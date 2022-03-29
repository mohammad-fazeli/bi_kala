import { Request, Response } from "express";
import { addProductSchema } from "../schemas/product.schema";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

import Product from "../models/product.model";
import Category from "../models/category.model";

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

async function getAllParentId(id: string) {
  try {
    let ids = [];
    const category = await Category.findById(id);
    ids.push(category._id);
    let parentId = category.parentId;
    while (parentId) {
      const parent = await Category.findById(parentId);
      ids.push(parent._id);
      parentId = parent.parentId;
    }
    return ids;
  } catch (err) {
    return false;
  }
}

function removeFile(obj: any) {
  try {
    if (obj.gallery) {
      for (const file of obj.gallery) {
        try {
          fs.unlinkSync(`./public/images/products/${file.filename}`);
          fs.unlinkSync(`./public/images/products/thumbnail-${file.filename}`);
        } catch {
          continue;
        }
      }
    }
    if (obj.image) {
      fs.unlinkSync(`./public/images/products/${obj.image[0].filename}`);
    }
  } catch (err) {
    console.log(err);
  }
}

export const addProduct = async (req: Request, res: Response) => {
  uploadImages.fields([
    { name: "gallery", maxCount: 5 },
    { name: "image", maxCount: 1 },
  ])(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        message: "خطا در آپلود تصویر",
      });
    }
    // validation
    try {
      await addProductSchema.validate({
        body: req.body,
        files: req.files,
      });
    } catch (err: any) {
      removeFile(req.files);
      return res.status(400).send(err.errors);
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let images: Array<{ filename: string; thumbnail: string }> = [];
    let image: string = files.image[0].filename;

    for (const file of files.gallery) {
      await sharp(file.destination + "/" + file.filename)
        .resize({
          width: 300,
          height: 300,
        })
        .toFile(file.destination + "/thumbnail-" + file.filename);
      images.push({
        filename: file.filename,
        thumbnail: "thumbnail-" + file.filename,
      });
    }

    const { id, name, brand, number, price, discount, review, specification } =
      req.body;

    let specification_parse;
    if (specification) {
      try {
        specification_parse = JSON.parse(specification);
      } catch (err) {
        removeFile(req.files);
        return res.status(400).send("مشخصات در فرمت درست ارئه نشده است");
      }
    }
    const categoryIds = await getAllParentId(id);
    if (!categoryIds) {
      removeFile(req.files);
      return res.status(500).send("خطا در دریافت شناسه دسته بندی");
    }
    try {
      const newProduct = new Product({
        name,
        brand,
        category: categoryIds,
        availability: true,
        number,
        price,
        discount,
        image,
        images,
        review,
        specification: specification_parse,
      });
      await newProduct.save();
      res.status(201).json({
        message: "محصول با موفقیت افزوده شد",
      });
    } catch (err) {
      removeFile(req.files);
      res.status(500).json({
        message: "خطا در ثبت محصول",
      });
    }
  });
};

export const updateProduct = async (req: Request, res: Response) => {
  uploadImages.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        message: "خطا در آپلود تصویر",
      });
    }
    const image: string = req.file?.filename as string;
    let file = {};
    if (image) {
      file = { image: [{ filename: image }] };
    }
    const { name, brand, number, price, discount, review, specification } =
      req.body;
    const { id } = req.params;

    let specification_parse;
    if (specification) {
      try {
        specification_parse = JSON.parse(specification);
      } catch (err) {
        removeFile(file);
        return res.status(400).send("مشخصات در فرمت درست ارئه نشده است");
      }
    }
    try {
      const product = await Product.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            image,
            name,
            brand,
            number,
            price,
            discount,
            review,
            specification: specification_parse,
          },
        }
      );
      if (!product) {
        removeFile(file);
        return res.status(404).send("محصولی با این شناسه یافت نشد");
      }
      removeFile({ image: [{ filename: product.image }] });
      res.status(200).json({
        message: "محصول با موفقیت ویرایش شد",
      });
    } catch (err) {
      removeFile(file);
      res.status(500).json({
        message: "خطا در ویرایش محصول",
      });
    }
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findOneAndDelete({ _id: id });
    if (!product) {
      return res.status(404).json({
        message: "محصول مورد نظر یافت نشد",
      });
    }
    removeFile({
      image: [{ filename: product.image }],
      gallery: product.images,
    });
    res.status(200).json({
      message: "محصول مورد نظر با موفقیت حذف شد",
    });
  } catch (err) {
    return res.status(500).json({
      message: "خطا در حذف محصول",
    });
  }
};
