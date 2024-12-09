import express, { Request, Response } from "express";
const router = express.Router();
import { uploadImage, uploadVideo } from "../../util/imageUpload";

router.post(
  "/upload/image",
  uploadImage.single("file"),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // File URL from Cloudinary
      const fileUrl = (req.file as any).path;

      res.status(200).json({
        message: "Image uploaded successfully",
        fileUrl,
      });
    } catch (error) {
      res.status(500).json({ message: "Error uploading image", error });
    }
  }
);

router.post(
  "/upload/video",
  uploadVideo.single("file"),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // File URL from Cloudinary
      const fileUrl = (req.file as any).path;

      res.status(200).json({
        message: "Video uploaded successfully",
        fileUrl,
      });
    } catch (error) {
      res.status(500).json({ message: "Error uploading video", error });
    }
  }
);

export default router;
