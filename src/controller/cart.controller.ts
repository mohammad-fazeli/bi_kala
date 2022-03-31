import { Response } from "express";
import Product from "../models/product.model";
import User from "../models/user.model";

export const addItem = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).send("محصول مورد نظر یافت نشد");
    if (!product.availability)
      return res.status(400).send("محصول مورد نظر موجود نیست");
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("کاربر مورد نظر یافت نشد");
    if (user.cart.some((item) => item.id === id))
      return res.status(400).send("این محصول در سبد خرید شما موجود است");
    user.cart.push({
      id,
      quantity: 1,
      price: product.price,
      discount: product.discount,
      image: product.image,
      name: product.name,
    });
    await user.save();
    res.status(200).json({ message: "محصول به سبد خرید اضافه شد" });
  } catch (err) {
    res.status(500).json({
      message: "خطایی در افزودن محصول به سبد خرید رخ داده است",
    });
  }
};

export const updateItem = async (req: any, res: Response) => {
  const { id, quantity } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("کاربر مورد نظر یافت نشد");
    const index = user.cart.findIndex((item) => item.id === id);
    if (index === -1) return res.status(404).send("محصول مورد نظر یافت نشد");
    const product = await Product.findById(id);
    if (!product) return res.status(404).send("محصول مورد نظر یافت نشد");
    if (!product.availability) {
      user.cart.splice(index as number, 1);
      await user.save();
      return res.status(400).send("محصول مورد نظر موجود نیست");
    }
    if (quantity > 0) {
      if (product.number < quantity)
        return res.status(400).send("موجودی این محصول کافی نیست");
      user.cart[index].quantity = quantity;
      user.cart[index].price = product.price;
      user.cart[index].discount = product.discount;
      user.cart[index].image = product.image;
      user.cart[index].name = product.name;
      await user.save();
      res
        .status(200)
        .json({ message: "سبد خرید بروزرسانی شد", data: user.cart });
    } else {
      user.cart.splice(index as number, 1);
      await user.save();
      res
        .status(200)
        .json({ message: "محصول از سبد خرید حذف شد", data: user.cart });
    }
  } catch (err) {
    res.status(500).json({
      message: "خطایی در بروزرسانی سبد خرید رخ داده است",
    });
  }
};

export const removeItem = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("کاربر مورد نظر یافت نشد");
    const index = user.cart.findIndex((item) => item.id === id);
    if (index === -1) return res.status(404).send("محصول مورد نظر یافت نشد");
    user.cart.splice(index, 1);
    await user.save();
    res
      .status(200)
      .json({ message: "محصول از سبد خرید حذف شد", data: user.cart });
  } catch (err) {
    res.status(500).json({
      message: "خطایی در حذف محصول از سبد خرید رخ داده است",
    });
  }
};

export const getCart = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).send("کاربر مورد نظر یافت نشد");
    res.status(200).json({ data: user.cart });
  } catch (err) {
    res.status(500).json({
      message: "خطایی در دریافت سبد خرید رخ داده است",
    });
  }
};
