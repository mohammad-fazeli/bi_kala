import { Request, Response } from "express";
import sharp from "sharp";
import { removeFiles } from "../utils/removeFile";

import {
  updateFilter_addProduct,
  updateFilter_removeProduct,
} from "../services/filter.services";

import Product from "../models/product.model";
import Category from "../models/category.model";

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

export const addProduct = async (req: Request, res: Response) => {
  const { id, name, brand, number, price, discount, review, specification } =
    req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  let gallery: Array<{ filename: string; thumbnail: string }> = [];
  let specification_parse;
  if (specification) {
    try {
      specification_parse = JSON.parse(specification);
    } catch {
      return res.status(400).json({
        message: "مشخصات در قالب JSON نیست",
      });
    }
  }
  const categoryIds = await getAllParentId(id);
  if (!categoryIds) {
    let destinations: string[] = [];
    Object.entries(files).forEach(([key, value]) => {
      destinations = [
        ...destinations,
        ...value.map((file: any) => `${file.destination}/${file.filename}`),
      ];
    });
    removeFiles(destinations);
    return res.status(500).send("خطا در دریافت شناسه دسته بندی");
  }

  for (const file of files.gallery) {
    await sharp(file.destination + "/" + file.filename)
      .resize({
        width: 300,
        height: 300,
      })
      .toFile(file.destination + "/thumbnail-" + file.filename);
    gallery.push({
      filename: file.filename,
      thumbnail: "thumbnail-" + file.filename,
    });
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
      image: files.image[0].filename,
      gallery,
      review,
      specification: specification_parse,
    });
    await newProduct.save();
    updateFilter_addProduct({
      brand: newProduct.brand,
      category: newProduct.category,
      price: newProduct.price,
      specification: newProduct.specification,
    });
    res.status(201).json({
      message: "محصول با موفقیت افزوده شد",
    });
  } catch (err) {
    let destinations: string[] = [];
    Object.entries(files).forEach(([key, value]) => {
      if (key === "gallery") {
        destinations = [
          ...destinations,
          ...value.map((file: any) => `${file.destination}/${file.filename}`),
          ...value.map(
            (file: any) => `${file.destination}/thumbnail-${file.filename}`
          ),
        ];
      } else {
        destinations = [
          ...destinations,
          ...value.map((file: any) => `${file.destination}/${file.filename}`),
        ];
      }
    });
    removeFiles(destinations);
    res.status(500).json({
      message: "خطا در ثبت محصول",
    });
  }
};
export const updateProduct = async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const image: string | undefined = files.image
    ? files.image[0].filename
    : undefined;
  const { name, brand, number, price, discount, review, specification } =
    req.body;
  const { id } = req.params;

  let specification_parse;
  if (specification) {
    try {
      specification_parse = JSON.parse(specification);
    } catch (err) {
      removeFiles([`/public/images/products/${image}`]);
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
      },
      {
        new: true,
      }
    );
    if (!product) {
      removeFiles([`/public/images/products/${image}`]);
      return res.status(404).send("محصولی با این شناسه یافت نشد");
    }
    removeFiles([product.image]);
    updateFilter_addProduct({
      brand: product.brand,
      category: product.category,
      price: product.price,
      specification: product.specification,
    });
    res.status(200).json({
      message: "محصول با موفقیت ویرایش شد",
    });
  } catch (err) {
    removeFiles([`/public/images/products/${image}`]);
    res.status(500).json({
      message: "خطا در ویرایش محصول",
    });
  }
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
    let destinations = [
      ...product.gallery.map(
        (image: any) => `/public/images/products/${image.filename}`
      ),
      ...product.gallery.map(
        (image: any) => `/public/images/products/${image.thumbnail}`
      ),
      product.image,
    ];
    removeFiles(destinations);
    updateFilter_removeProduct({
      brand: product.brand,
      category: product.category,
      price: product.price,
      specification: product.specification,
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

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({
        message: "محصول مورد نظر یافت نشد",
      });
    }
    product.views += 1;
    await product.save();
    res.status(200).json({
      message: "محصول مورد نظر با موفقیت ارسال شد",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      message: "خطا در بارگذاری محصول",
    });
  }
};

export const addImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  await sharp(files.gallery[0].destination + "/" + files.gallery[0].filename)
    .resize({
      width: 300,
      height: 300,
    })
    .toFile(
      files.gallery[0].destination + "/thumbnail-" + files.gallery[0].filename
    );
  try {
    const product = await Product.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          images: {
            filename: files.gallery[0].filename,
            thumbnail: "thumbnail-" + files.gallery[0].filename,
          },
        },
      }
    );
    if (!product) {
      removeFiles([
        files.gallery[0].destination + "/" + files.gallery[0].filename,
        files.gallery[0].destination +
          "/thumbnail-" +
          files.gallery[0].filename,
      ]);
      return res.status(404).json({
        message: "محصول مورد نظر یافت نشد",
      });
    }
    res.status(200).json({
      message: "تصویر با موفقیت اضافه شد",
    });
  } catch (err) {
    console.log(err);
    removeFiles([
      files.gallery[0].destination + "/" + files.gallery[0].filename,
      files.gallery[0].destination + "/thumbnail-" + files.gallery[0].filename,
    ]);
    res.status(500).json({
      message: "خطا در بارگذاری تصویر",
    });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { filename } = req.body;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "محصول مورد نظر یافت نشد",
      });
    }
    if (product.images.length === 1) {
      return res.status(400).json({
        message: "حداقل یک تصویر باید وجود داشته باشد",
      });
    }
    const index = product.images.findIndex(
      (image: any) => image.filename === filename
    );
    if (index === -1) {
      return res.status(404).json({
        message: "تصویر مورد نظر یافت نشد",
      });
    }
    product.images.splice(index, 1);
    await product.save();
    removeFiles([
      `/public/images/products/${filename}`,
      `/public/images/products/thumbnail-${filename}`,
    ]);
    res.status(200).json({
      message: "تصویر مورد نظر با موفقیت حذف شد",
    });
  } catch (err) {
    res.status(500).json({
      message: "خطا در حذف تصویر",
    });
  }
};
