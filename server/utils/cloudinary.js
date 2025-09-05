import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
    cloudinary,
    params: {
    folder: 'ecommerce', // Save all images in this folder
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, quality: 'auto' }]
  }
});

export const upload = multer({ storage });