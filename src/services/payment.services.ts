import PaymentModel, { PaymentDocument } from "../models/Payment.model";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

class Payment {
  private paymentModel: mongoose.Model<PaymentDocument>;
  constructor(paymentModel: mongoose.Model<PaymentDocument>) {
    this.paymentModel = paymentModel;
  }
  async create(orderId: string, amount: number) {
    const payment = new this.paymentModel({
      amount,
      orderId,
      paymentCode: Date.now() + Math.floor(Math.random() * 1000000),
    });
    await payment.save();
    const token = jwt.sign(
      {
        orderId,
        amount,
        paymentCode: payment.paymentCode,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "10m",
      }
    );
    return token;
  }
  async verifyToken(token: string) {
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: any, decoded: any) => {
        if (err) {
          throw new Error("Invalid Token");
        }
        return decoded;
      }
    );
  }
  async set(paymentCode: string, successful: boolean) {
    const payment = await this.paymentModel.findOne({ paymentCode });
    if (!payment) throw new Error("Payment not found");
    if (payment.isModified("successful"))
      throw new Error("Payment already verified");
    payment.successful = successful;
    await payment.save();
  }
  async verifyPayment(orderId: string) {
    const payment = await this.paymentModel.findOne({ orderId });

    if (!payment)
      return {
        code: 404,
        successful: null,
      };
    if (payment.verify) {
      return {
        code: 101,
        successful: payment.successful,
      };
    }
    return {
      code: 100,
      successful: payment.successful,
    };
  }
}

export default new Payment(PaymentModel);
