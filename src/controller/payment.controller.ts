import { Request, Response } from "express";
import Payment from "../models/Payment.model";
import jwt from "jsonwebtoken";

export const startPay = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    let decode: any;
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: any, decoded: any) => {
        if (err) {
          return res.status(401).send({
            message: "Token is not valid",
          });
        }
        decode = decoded;
      }
    );
    const payment = await Payment.findOne({ PaymentCode: decode.PaymentCode });
    if (payment) {
      return res.send("Payment is already done");
    }
    res.status(200).send({
      message: "send",
      decoded: decode,
    });
  } catch (err) {
    res.status(500).json({
      message: "مشکلی در سرور پیش آمده است",
    });
  }
};

export const setPayment = async (req: Request, res: Response) => {
  const { token, successful } = req.body;
  try {
    let decode: any;
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: any, decoded: any) => {
        if (err) {
          return res.send("Invalid Token");
        }
        decode = decoded;
      }
    );
    const payment = await Payment.findOne({ PaymentCode: decode.PaymentCode });
    if (payment) {
      return res.send("Payment is already done");
    }
    console.log(decode);

    const newPayment = new Payment({
      amount: decode?.amount,
      successful: successful,
      PaymentCode: decode?.PaymentCode,
      orderId: decode?.orderId,
    });
    await newPayment.save();
    res.send({
      message: "Payment is done",
      paymentCode: decode?.PaymentCode,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "مشکلی در سرور پیش آمده است",
    });
  }
};
