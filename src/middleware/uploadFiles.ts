import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/products");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const uploadImages = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return cb(new Error("فقط تصاویر مجاز هستند"));
    }
    cb(null, true);
  },
  limits: { fileSize: 700000 },
});

const upload =
  (array: { name: string; maxCount: number }[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    uploadImages.fields(array)(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          message: "خطا در آپلود تصویر",
        });
      }
      next();
    });
  };
export default upload;
