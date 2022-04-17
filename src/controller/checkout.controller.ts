import { Request, Response } from "express";
import Checkout from "../services/checkout.services";
import Cart from "../services/cart.services";
export const checkout = async (req: any, res: Response) => {
  try {
    const { paymentType, address } = req.body;
    const { userId } = req.user;
    if (paymentType !== "cash" || paymentType !== "online")
      throw new Error("Invalid payment type");
    const result = await Checkout.checkout(userId, paymentType, address);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const verify = async (req: any, res: Response) => {
  try {
    const { orderId } = req.params;
    const result = await Checkout.verify(orderId);
    if (result.payment) {
      await Cart.clear(req.user.userId);
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
