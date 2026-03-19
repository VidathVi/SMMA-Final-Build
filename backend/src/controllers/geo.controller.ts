import { Request, Response } from 'express';
import { callFastAPI } from '../services/geo.service';

export const generateCaption = async (req: Request, res: Response) => {
  try {
    const { topic, platform, tone } = req.body;
    const result = await callFastAPI('/generate-caption', { topic, platform, tone });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const optimizeContent = async (req: Request, res: Response) => {
  try {
    const { caption, tone, target_language, generate_variants } = req.body;
    const result = await callFastAPI('/optimize-content', { 
        caption, tone, target_language, generate_variants 
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const predictEngagement = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const result = await callFastAPI('/predict-engagement', { content });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const detectLanguage = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const result = await callFastAPI('/detect-language', { content });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
