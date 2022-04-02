import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  successful: { type: Boolean, required: true },
  verify: { type: Boolean, required: true, default: false },
  PaymentCode: { type: Number, required: true },
  orderId: { type: String, required: true },
});

const Payment = mongoose.model("Payment", PaymentSchema);

export default Payment;
