import { Request, Response } from "express";
import User from "../models/user.model";
import Product from "../models/product.model";
import Order from "../models/order.model";
import { signToken, verify } from "../services/Payment.services";
import { createOrder, updateProducts } from "../services/checkout.services";

export const checkout = async (req: any, res: Response) => {
  try {
    const { address, paymentType } = req.body;
    if (paymentType !== "online" || paymentType !== "cash") {
      return res.status(400).json({
        message: "نوع پرداخت را به درستی وارد کنید",
      });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    let amount = 0;
    if (user.cart.length > 0) {
      for (const item of user.cart) {
        const product = await Product.findById(item.id);
        if (!product) {
          return res.status(404).send({
            message: "Product not found",
          });
        }
        if (product.number < item.quantity) {
          return res.status(400).send({
            message: "Product not enough",
          });
        }
        if (!product.availability) {
          return res.status(400).send({
            message: "Product not available",
          });
        }
        amount += product.price * item.quantity;
      }
      updateProducts(user.cart, "buy");
    } else {
      return res.status(404).send({
        message: "Cart is empty",
      });
    }
    const orderId = await createOrder(
      user._id,
      user.cart,
      amount,
      paymentType,
      address
    );
    user.cart = [];
    await user.save();
    if (paymentType === "online") {
      if (amount >= 300000) {
        const token = await signToken(amount, orderId);
        return res.status(200).json({
          token: token,
        });
      }

      const token = await signToken(amount + 25000, orderId);
      return res.status(200).json({
        token: token,
      });
    } else if (paymentType === "cash") {
      res.status(200).json({
        message: "Order created",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "مشکلی در سرور پیش آمده است",
    });
  }
};

export const verifyRequest = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const payment = await verify(orderId);
  if (payment.code === 404) {
    return res.status(404).send({
      message: "Payment is not found",
    });
  } else if (payment.code === 101) {
    res.status(400).send({
      message: "Payment is already done",
    });
  } else if (payment.code === 100) {
    const order = await Order.findById(payment.orderId);
    if (!order) {
      return res.status(404).send({
        message: "Order not found",
      });
    }
    order.paying = false;
    order.Paid = payment.successful;
    await order.save();
    res.status(200).send({
      message: "Payment is done",
      successful: payment.successful,
      orderId: payment.orderId,
    });
  } else if (payment.code === 500) {
    res.status(500).send({
      message: "مشکلی در سرور پیش آمده است",
    });
  }
};

export const changePayment = async (req: any, res: Response) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findOne({ _id: orderId, userId: req.user._id });
    if (!order) {
      return res.status(404).send({
        message: "Order not found",
      });
    }
    if (order.paymentType === "cash") {
      return res.status(400).send({
        message: "Order is not online",
      });
    }
    if (order.Paid) {
      return res.status(400).send({
        message: "Order is already paid",
      });
    }
    order.paymentType = "cash";
    await order.save();
    res.status(200).send({
      message: "Payment is changed",
    });
  } catch (err) {
    res.status(500).send({
      message: "مشکلی در سرور پیش آمده است",
    });
  }
};

export const retryPayment = async (req: any, res: Response) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findOne({ _id: orderId, userId: req.user._id });
    if (!order) {
      return res.status(404).send({
        message: "Order not found",
      });
    }
    if (order.paymentType === "cash") {
      return res.status(400).send({
        message: "Order is not online",
      });
    }
    if (order.Paid) {
      return res.status(400).send({
        message: "Order is already paid",
      });
    }
    if (order.paying) {
      return res.status(400).send({
        message: "Order is already paying",
      });
    }
    order.paying = true;
    await order.save();
    const token = await signToken(order.amount, orderId);
    res.status(200).json({
      token,
    });
  } catch (err) {
    res.status(500).send({
      message: "مشکلی در سرور پیش آمده است",
    });
  }
};

export const cancelOrder = async (req: any, res: Response) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findOne({ _id: orderId, userId: req.user._id });
    if (!order) {
      return res.status(404).send({
        message: "Order not found",
      });
    }
    if (order.delivery) {
      return res.status(400).send({
        message: "Order is already delivered",
      });
    }
    if (order.Paid) {
      //Refund operation
    }
    updateProducts(order.items, "cancel");
    order.canceled = true;
    await order.save();
    res.status(200).send({
      message: "Order is canceled",
    });
  } catch (err) {
    res.status(500).send({
      message: "مشکلی در سرور پیش آمده است",
    });
  }
};
