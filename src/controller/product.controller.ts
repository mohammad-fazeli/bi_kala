import { Request, Response } from "express";
import { removeFiles } from "../utils/removeFile";
import { makeThumbnail } from "../utils/makeThumbnail";
import {
  updateFilter_addProduct,
  updateFilter_removeProduct,
} from "../services/filter.services";
import Product from "../services/product.services";

export const addProduct = async (req: Request, res: Response) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const { id, name, brand, number, price, discount, review, specification } =
    req.body;
  try {
    const gallery = await makeThumbnail(files.gallery);
    const newProduct = await Product.add({
      id,
      name,
      brand,
      number,
      price,
      discount,
      image: files.image[0].filename,
      gallery,
      review,
      specification: JSON.parse(specification),
    });
    updateFilter_addProduct({
      brand: newProduct.brand,
      categories: newProduct.categories,
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
        value.forEach((file: any) => {
          destinations.push(`${file.destination}/${file.filename}`);
          destinations.push(`${file.destination}/thumbnail-${file.filename}`);
        });
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
  try {
    const product = await Product.update(id, {
      image,
      name,
      brand,
      number,
      price,
      discount,
      review,
      specification: JSON.parse(specification),
    });
    removeFiles([product.image]);
    updateFilter_addProduct({
      brand: product.brand,
      categories: product.categories,
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
  try {
    const product = await Product.delete(req.params.id);
    let destinations = [product.image];
    for (const image of product?.gallery) {
      destinations.push(`/public/images/products/${image.filename}`);
      destinations.push(`/public/images/products/${image.thumbnail}`);
    }
    removeFiles(destinations);
    updateFilter_removeProduct({
      brand: product.brand,
      categories: product.categories,
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
  try {
    const product = await Product.getOne(req.params.id);
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

export const getProducts = async (req: Request, res: Response) => {
  const { filters = [], sort, id, page, limit } = req.body;
  try {
    const products = await Product.getProducts(
      id as string,
      filters,
      page,
      limit,
      sort
    );
    res.status(200).json({
      products,
      page,
    });
  } catch (err) {
    res.status(500).json({
      message: "مشکلی در ارسال محصولات به وجود آمده است",
    });
  }
};

export const addImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  try {
    const gallery = await makeThumbnail(files.gallery);
    await Product.addImage(id, gallery[0]);
    res.status(200).json({
      message: "تصویر با موفقیت اضافه شد",
    });
  } catch (err) {
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
    await Product.deleteImage(id, filename);
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
