import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    userId: { type: String, required: true },
    address: {
      type: {
        street: String,
        city: String,
        state: String,
        alley: String,
        HouseNumber: String,
      },
      required: true,
    },
    items: {
      type: [
        {
          id: String,
          quantity: Number,
          name: String,
          price: Number,
          discount: Number,
          image: String,
        },
      ],
      required: true,
    },
    paymentType: { type: String, required: true },
    paid: { type: Boolean, required: true, default: false },
    paying: { type: Boolean, required: true, default: false },
    delivery: { type: Boolean, required: true, default: false },
    canceled: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
