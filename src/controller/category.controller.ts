import { Request, Response } from "express";
import Category from "../services/category.services";

export const addCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = await Category.create(req.body.name, req.body.parentId);
    res.status(200).json({
      message: "دسته بندی با موفقیت اضافه شد",
      category: newCategory,
    });
  } catch (err) {
    res.status(500).json({ message: "مشکلی در سرور به وجود آمده است" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.update(req.body.id, req.body.name);
    if (!category) {
      return res.status(404).json({
        message: "دسته بندی مورد نظر یافت نشد",
      });
    }
    res.status(200).json({
      message: "دسته بندی با موفقیت ویرایش شد",
      category,
    });
  } catch (err) {
    res.status(500).json({ message: "مشکلی در سرور به وجود آمده است" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.delete(req.body.id);
    if (!category) {
      return res.status(404).json({
        message: "دسته بندی مورد نظر یافت نشد",
      });
    }
    res.status(200).json({
      message: "دسته بندی با موفقیت حذف شد",
    });
  } catch (err) {
    res.status(500).json({ message: "مشکلی در سرور به وجود آمده است" });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categoryList = await Category.getAll();
    res.status(200).json({
      message: "دسته بندی ها با موفقیت ارسال شد",
      categories: categoryList,
    });
  } catch (err) {
    res.status(500).json({ message: "مشکلی در سرور به وجود آمده است" });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.get(req.query.id as string);
    if (!category) {
      return res.status(404).json({
        message: "دسته بندی مورد نظر یافت نشد",
      });
    }
    res.status(200).json({
      message: "دسته بندی مورد نظر با موفقیت ارسال شد",
      category,
    });
  } catch (err) {
    res.status(500).json({ message: "مشکلی در سرور به وجود آمده است" });
  }
};
