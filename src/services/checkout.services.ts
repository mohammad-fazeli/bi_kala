import OrderModel, { OrderDocument } from "../models/order.model";
import Payment from "./payment.services";
import Cart from "./cart.services";
import Product from "./product.services";
import mongoose from "mongoose";

type payment = "cash" | "online";

class Checkout {
  private orderModel: mongoose.Model<OrderDocument>;
  constructor(orderModel: mongoose.Model<OrderDocument>) {
    this.orderModel = orderModel;
  }
  async checkout(
    userId: string,
    paymentType: payment,
    address: {
      street: string;
      city: string;
      state: string;
      alley: string;
      HouseNumber: string;
    }
  ) {
    const cart = await Cart.get(userId);
    if (cart.length === 0) throw new Error("Cart is empty");
    let amount = 0;
    for (const item of cart) {
      amount += item.price * item.quantity;
    }
    const order = new this.orderModel({
      amount,
      userId,
      address,
      items: cart,
      paymentType,
    });
    await order.save();
    if (paymentType === "online") {
      const paymentToken = await Payment.create(order._id, amount);
      return { paymentToken, order };
    }
    return { paymentToken: null, order };
  }
  async verify(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new Error("Order not found");
    const result = await Payment.verifyPayment(orderId);
    if (!result.successful) {
      throw new Error("Payment not found");
    }
    if (result.code === 101) {
      return {
        code: 101,
        payment: result.successful,
      };
    }
    order.paid = result.successful;
    await order.save();
    if (result.successful) {
      await Product.reduce(order.items);
    }
    return {
      code: 100,
      payment: result.successful,
    };
  }
  //   async retry(corderId: string): Promise<string> {}
  //   async cancel(corderId: string): Promise<boolean> {}
}

export default new Checkout(OrderModel);
