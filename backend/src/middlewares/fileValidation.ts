const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "video/mp4",
];

export const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: any
) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, WEBP, PDF, and MP4 are allowed."));
  }
};