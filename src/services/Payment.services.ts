import Payment from "../models/Payment.model";
import jwt from "jsonwebtoken";

export const signToken = async (amount: number, orderId: string) => {
  const token = jwt.sign(
    {
      amount: amount,
      orderId,
      PaymentCode: Math.floor(Math.random() * 1000000) + Date.now(),
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "10m" }
  );
  return token;
};

export const verify = async (paymentCode: string) => {
  try {
    const payment = await Payment.findOne({ paymentCode });
    if (!payment) {
      return {
        code: 404,
      };
    }
    if (payment.verify) {
      return {
        code: 101,
        paymentCode: payment.paymentCode,
        successful: payment.successful,
        orderId: payment.orderId,
        amount: payment.amount,
      };
    }
    payment.verify = true;
    await payment.save();
    return {
      code: 100,
      paymentCode: payment.paymentCode,
      successful: payment.successful,
      orderId: payment.orderId,
      amount: payment.amount,
    };
  } catch (err) {
    return {
      code: 500,
    };
  }
};
