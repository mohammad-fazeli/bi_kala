import { Request, Response } from "express";
import mongoose from "mongoose";
import Category from "../models/category.model";
import Product from "../models/product.model";

export const addCategory = async (req: Request, res: Response) => {
  const { name, parentId } = req.body;
  try {
    const newCategory = new Category({ name, parentId });
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
  const { id, page, limit } = req.query;
  const { filters = [], sort } = req.body;
  try {
    const categories = await Category.find({});
    const categoryList = createCategories(categories);
    const category = categoryList.find((cat) => cat._id == id);
    if (!category) {
      return res.status(404).json({
        message: "دسته بندی مورد نظر یافت نشد",
      });
    }
    let search: object = {
      category: { $in: new mongoose.Types.ObjectId(id as string) },
    };
    filters.forEach((filter: { finder: string; option: any[] }) => {
      if (filter.finder == "brand") {
        search = {
          ...search,
          brand: { $in: filter.option },
        };
      } else if (filter.finder == "price") {
        search = {
          ...search,
          price: { $gte: filter.option[0], $lte: filter.option[1] },
        };
      } else if (filter.finder == "availability") {
        search = {
          ...search,
          availability: filter.option,
        };
      } else if (filter.finder == "discount") {
        if (filter.option[0]) {
          search = {
            ...search,
            discount: { $nin: 0 },
          };
        }
      } else {
        search = {
          ...search,
          specification: {
            $elemMatch: {
              title: filter.finder,
              value: { $in: filter.option },
            },
          },
        };
      }
    });
    let sort_query: object = {};
    if (sort == "ارزان ترین") {
      sort_query = {
        price: 1,
      };
    } else if (sort == "گران ترین") {
      sort_query = {
        price: -1,
      };
    } else if (sort == "جدید ترین") {
      sort_query = {
        createdAt: -1,
      };
    } else if (sort == "پربازدیدترین") {
      sort_query = {
        views: -1,
      };
    } else if (sort == "پرفروش ترین") {
      sort_query = {
        sales: -1,
      };
    } else {
      sort_query = {
        createdAt: -1,
      };
    }

    const products = await Product.find(
      search,
      {},
      {
        limit: parseInt(limit as string),
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        sort: sort_query,
      }
    );
    const result = {
      ...category,
      products,
    };
    res.status(200).json({
      message: "دسته بندی مورد نظر با موفقیت ارسال شد",
      category: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "مشکلی در ارسال دسته بندی به وجود آمده است",
    });
  }
};
