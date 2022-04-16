import { Response } from "express";
import Product from "../models/product.model";
import Cart from "../services/cart.services";

export const addItem = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const cart = await Cart.add(id, req.user.id);
    res.status(200).json({ message: "محصول به سبد خرید اضافه شد", data: cart });
  } catch (err) {
    res.status(500).json({
      message: "خطایی در افزودن محصول به سبد خرید رخ داده است",
    });
  }
};

export const updateItem = async (req: any, res: Response) => {
  const { id, quantity } = req.body;
  try {
    const cart = await Cart.update(id, quantity, req.user.id);
    res.status(200).json({
      message: "محصول از سبد خرید حذف شد",
      data: cart,
    });
  } catch (err) {
    res.status(500).json({
      message: "خطایی در بروزرسانی سبد خرید رخ داده است",
    });
  }
};

export const removeItem = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const cart = await Cart.remove(id, req.user.id);
    res.status(200).json({
      message: "محصول از سبد خرید حذف شد",
      data: cart,
    });
  } catch (err) {
    res.status(500).json({
      message: "خطایی در حذف محصول از سبد خرید رخ داده است",
    });
  }
};

export const getCart = async (req: any, res: Response) => {
  try {
    const cart = await Cart.get(req.user.id);
    res.status(200).json({ data: cart });
  } catch (err) {
    res.status(500).json({
      message: "خطایی در دریافت سبد خرید رخ داده است",
    });
  }
};
