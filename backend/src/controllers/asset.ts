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
    const version = 1;

    return res.status(200).json({
      message: "File uploaded successfully",
      fileUrl,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      version,
    });
  } catch (error) {
    return res.status(500).json({ message: "Upload failed", error });
  }

};

export const getAssets = (req: Request, res: Response) => {
  const { campaignId } = req.query;

  const assets = [
    {
      id: 1,
      campaignId: "123",
      fileUrl: "local/123-image1.jpg",
      version: 1,
    },
    {
      id: 2,
      campaignId: "123",
      fileUrl: "local/123-video1.mp4",
      version: 2,
    },
    {
      id: 3,
      campaignId: "456",
      fileUrl: "local/456-image2.png",
      version: 1,
    },
  ];

  const filteredAssets = campaignId
    ? assets.filter(a => a.campaignId === campaignId)
    : assets;

  res.json(filteredAssets);
};

export const addComment = (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, comment } = req.body;

  if (!userId || !comment) {
    return res.status(400).json({
      message: "userId and comment are required",
    });
  }

  const newComment = {
    id: Date.now(),
    assetId: id,
    userId,
    comment,
    createdAt: new Date().toISOString(),
  };

  return res.status(201).json({
    message: "Comment added successfully",
    data: newComment,
  });
};