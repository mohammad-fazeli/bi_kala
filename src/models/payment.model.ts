import mongoose from "mongoose";

export interface PaymentDocument extends mongoose.Document {
  amount: number;
  successful: boolean;
  verify: boolean;
  paymentCode: number;
  orderId: string;
}

const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  successful: { type: Boolean, required: true, default: false },
  verify: { type: Boolean, required: true, default: false },
  paymentCode: { type: Number, required: true },
  orderId: { type: String, required: true },
});

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;
