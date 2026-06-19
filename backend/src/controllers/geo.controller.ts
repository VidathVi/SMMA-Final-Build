import { Request, Response } from "express";
import { callFastAPI } from "../services/geo.service";

export const generateCaption = async (req: Request, res: Response) => {
  try {
    const { topic, platform, tone } = req.body;
    const result = await callFastAPI("/generate-caption", {
      topic,
      platform,
      tone,
    });
    res.json(result);
  } catch (error: any) {
    console.error("GEO API Fallback Triggered:", error.message);
    res.json({
      status: "success",
      caption: `[Fallback] A beautiful post about ${req.body.topic || "this topic"}! #orean360`,
    });
  }
};

export const optimizeContent = async (req: Request, res: Response) => {
  try {
    const { caption, tone, target_language, generate_variants } = req.body;
    const result = await callFastAPI("/optimize-content", {
      caption,
      tone,
      target_language,
      generate_variants,
    });
    res.json(result);
  } catch (error: any) {
    console.error("GEO API Fallback Triggered:", error.message);
    res.json({
      status: "success",
      optimized_result:
        req.body.caption || "This is your fallback optimized caption.",
    });
  }
};

export const predictEngagement = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const result = await callFastAPI("/predict-engagement", { content });
    res.json(result);
  } catch (error: any) {
    console.error("GEO API Fallback Triggered:", error.message);
    res.json({
      status: "success",
      engagement_score: 50,
      suggestions: ["Server unreachable. Add hashtags!"],
    });
  }
};

export const detectLanguage = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const result = await callFastAPI("/detect-language", { content });
    res.json(result);
  } catch (error: any) {
    console.error("GEO API Fallback Triggered:", error.message);
    res.json({ status: "success", language: "English" });
  }
};
