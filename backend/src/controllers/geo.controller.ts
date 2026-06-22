import { Request, Response } from "express";
import { callGeoEngine } from "../services/geo.service";
import { postService } from "../services/post.service";

export const generateCaption = async (req: Request, res: Response) => {
  try {
    const { topic, platform, tone, targetAudience, goal, campaignId } = req.body;
    
    // Construct the vLLM prompt
    const systemPrompt = "You are a professional social media marketing expert. Your job is to generate a caption, hashtags, alt-text, and a meta description. Do not generate the post image or video itself. Output strictly in the following JSON format: {\"caption\": \"...\", \"hashtags\": [\"...\"], \"altText\": \"...\", \"metaDescription\": \"...\"}";
    const userPrompt = `Create metadata for a post on ${platform}. Topic: ${topic}. Tone: ${tone}. Target Audience: ${targetAudience}. Goal: ${goal}.`;

    const vllmPayload = {
      model: "Vi-ViD/GEO-Engine",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 512
    };

    const result = await callGeoEngine(vllmPayload);
    
    // Parse the output
    const rawContent = result.choices?.[0]?.message?.content || "{}";
    let parsedContent;
    try {
      parsedContent = JSON.parse(rawContent);
    } catch (parseError) {
      // Fallback parsing if LLM didn't return strict JSON
      parsedContent = {
        caption: rawContent,
        hashtags: [],
        altText: "",
        metaDescription: ""
      };
    }

    // Automatically save as a draft post if campaignId is provided
    let savedPost = null;
    if (campaignId) {
      // Assuming post content can hold the JSON stringified metadata for now
      savedPost = await postService.create({
        content: JSON.stringify(parsedContent),
        campaignId: campaignId
      });
    }

    res.json({
      status: "success",
      data: parsedContent,
      post: savedPost
    });
  } catch (error: any) {
    console.error("GEO API Error:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};

export const optimizeContent = async (req: Request, res: Response) => {
  try {
    const { caption, tone, target_language, generate_variants } = req.body;
    
    const vllmPayload = {
      model: "Vi-ViD/GEO-Engine",
      messages: [
        { role: "system", content: "You are an AI content optimizer. Optimize the provided caption." },
        { role: "user", content: `Caption: ${caption}\nTone: ${tone}\nLanguage: ${target_language}\nVariants: ${generate_variants}` }
      ],
      temperature: 0.7,
      max_tokens: 512
    };

    const result = await callGeoEngine(vllmPayload);
    res.json({ status: "success", data: result.choices?.[0]?.message?.content });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const predictEngagement = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const vllmPayload = {
      model: "Vi-ViD/GEO-Engine",
      messages: [
        { role: "system", content: "You are an AI engagement predictor. Output a JSON with engagement_score (0-100) and an array of suggestions." },
        { role: "user", content: `Predict engagement for this content: ${content}` }
      ],
      temperature: 0.5,
      max_tokens: 256
    };

    const result = await callGeoEngine(vllmPayload);
    res.json({ status: "success", data: result.choices?.[0]?.message?.content });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const detectLanguage = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const vllmPayload = {
      model: "Vi-ViD/GEO-Engine",
      messages: [
        { role: "system", content: "You are a language detection AI. Output only the name of the language." },
        { role: "user", content: `Detect language of: ${content}` }
      ],
      temperature: 0.1,
      max_tokens: 16
    };

    const result = await callGeoEngine(vllmPayload);
    res.json({ status: "success", language: result.choices?.[0]?.message?.content?.trim() });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
