import { Request, Response } from "express";
import Category from "../models/category.model";

export const addCategory = async (req: Request, res: Response) => {
  const { name, parentId } = req.body;
  let categoryObj = {
    name,
    filter: [
      { title: "برند", type: "checkbox", option: [], finder: "brand" },
      {
        title: "فقط کالاهای موجود",
        type: "switch",
        option: [false],
        finder: "availability",
      },
      {
        title: "فقط کالاهای دارای تخفیف",
        type: "switch",
        option: [false],
        finder: "discount",
      },
      { title: "قیمت", type: "range", option: [0, 0], finder: "price" },
    ],
    parentId,
  };
  try {
    const newCategory = new Category(categoryObj);
    await newCategory.save();
    res.status(200).json({
      message: "دسته بندی با موفقیت اضافه شد",
      category: newCategory,
    });
  } catch (err) {
    res.status(500).json({
      message: "مشکلی در اضافه کردن دسته بندی به وجود آمده است",
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { name, id } = req.body;
  try {
    const category = await Category.findOneAndUpdate(
      { _id: id },
      { $set: { name } },
      { new: true }
    );
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
    res.status(500).json({
      message: "مشکلی در ویرایش دسته بندی به وجود آمده است",
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const category = await Category.findOneAndDelete({ _id: id });
    if (!category) {
      return res.status(404).json({
        message: "دسته بندی مورد نظر یافت نشد",
      });
    }
    res.status(200).json({
      message: "دسته بندی با موفقیت حذف شد",
    });
  } catch (err) {
    res.status(500).json({
      message: "مشکلی در حذف دسته بندی به وجود آمده است",
    });
  }
};

function createCategories(
  categories: Array<{
    parentId: string;
    name: string;
    filter: Array<object>;
    _id: string;
  }>,
  parentId: any = null
): Array<{
  _id: string;
  name: string;
  filter: Array<object>;
  parentId?: string;
  children: Array<object>;
}> {
  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (const cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      filter: cate.filter,
      children: createCategories(categories, cate._id),
    });
  }
  return categoryList;
}

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({});
    const categoryList = createCategories(categories);
    res.status(200).json({
      message: "دسته بندی ها با موفقیت ارسال شد",
      categories: categoryList,
    });
  } catch (err) {
    res.status(500).json({
      message: "مشکلی در دریافت دسته بندی ها به وجود آمده است",
    });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const categories = await Category.find({});
    const categoryList = createCategories(categories);
    const category = categoryList.find((cat) => cat._id == id);
    if (!category) {
      return res.status(404).json({
        message: "دسته بندی مورد نظر یافت نشد",
      });
    }
    res.status(200).json({
      message: "دسته بندی مورد نظر ارسال شد",
      category,
    });
  } catch (err) {
    res.status(500).json({
      message: "مشکلی در ارسال دسته بندی به وجود آمده است",
    });
  }
};
