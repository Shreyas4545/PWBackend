import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.cofig";

const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () => ({
    folder: "images", // Cloudinary folder for images
    allowed_formats: ["jpg", "jpeg", "png", "pdf"], // File types allowed
  }),
});

const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () => ({
    folder: "videos", // Folder name in Cloudinary
    resource_type: "video", // This is essential for videos
    allowed_formats: ["mp4", "avi", "mkv", "mov"], // File types allowed
  }),
});

export const uploadImage = multer({ storage: imageStorage });
export const uploadVideo = multer({
  storage: videoStorage,
  limits: {
    fileSize: 1024 * 1024 * 1024, // 1GB (adjust according to your needs)
  },
});
