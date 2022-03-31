import { Request, Response } from "express";
import Category from "../models/category.model";

export const addFilter = async (req: Request, res: Response) => {
  const { title, finder, id } = req.body;
  try {
    const category = await Category.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          filter: {
            title,
            type: "checkbox",
            finder,
          },
        },
      }
    );
    if (!category) {
      return res.status(404).send({
        message: "دسته بندی مورد نظر یافت نشد",
      });
    }
    return res.status(200).send({
      message: "فیلتر با موفقیت اضافه شد",
      data: category,
    });
  } catch (err) {
    res.status(500).send({
      message: "خطا در ثبت فیلتر",
    });
  }
};

export const updateFilter = async (req: Request, res: Response) => {
  const { title, finder, filterId } = req.body;
  try {
    const category = await Category.findOneAndUpdate(
      {
        "filter._id": filterId,
      },
      {
        $set: {
          "filter.$.title": title,
          "filter.$.finder": finder,
        },
      }
    );
    if (!category) {
      return res.status(404).send({
        message: "فیلتر مورد نظر یافت نشد",
      });
    }
    return res.status(200).send({
      message: "فیلتر با موفقیت ویرایش شد",
    });
  } catch (err) {
    res.status(500).send({
      message: "خطا در ویرایش فیلتر",
    });
  }
};

export const deleteFilter = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const category = await Category.findOneAndUpdate(
      {
        "filter._id": id,
      },
      {
        $pull: {
          filter: {
            _id: id,
          },
        },
      }
    );
    if (!category) {
      return res.status(404).send({
        message: "فیلتر مورد نظر یافت نشد",
      });
    }
    return res.status(200).send({
      message: "فیلتر با موفقیت حذف شد",
    });
  } catch (err) {
    res.status(500).send({
      message: "خطا در حذف فیلتر",
    });
  }
};
