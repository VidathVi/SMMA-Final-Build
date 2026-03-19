import { Request, Response } from "express";

export const testAsset = (req: Request, res: Response) => {
  res.json({ message: "Asset controller working" });
};

export const uploadAsset = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

const fileUrl = `local/${Date.now()}-${req.file.originalname}`;

    return res.status(200).json({
      message: "File uploaded successfully",
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    });
  } catch (error) {
    return res.status(500).json({ message: "Upload failed", error });
  }
};