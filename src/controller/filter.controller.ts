import { Request, Response } from "express";
import Filter from "../services/filter.services";

export const addFilter = async (req: Request, res: Response) => {
  const { title, finder, id } = req.body;
  try {
    const category = await Filter.add(id, title, finder);
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
    const category = await Filter.update(filterId, title, finder);
    return res.status(200).send({
      message: "فیلتر با موفقیت ویرایش شد",
      date: category,
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
    await Filter.remove(id);
    return res.status(200).send({
      message: "فیلتر با موفقیت حذف شد",
    });
  } catch (err) {
    res.status(500).send({
      message: "خطا در حذف فیلتر",
    });
  }
};
