import mongoose from "mongoose";

export interface OrderDocument extends mongoose.Document {
  amount: number;
  userId: string;
  address: {
    street: string;
    city: string;
    state: string;
    alley: string;
    houseNumber: string;
  };
  items: {
    id: string;
    quantity: number;
    name: string;
    price: number;
    discount: number;
    image: string;
  }[];
  paymentType: string;
  paid: boolean;
  paying: boolean;
  delivery: boolean;
  canceled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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

OrderSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 600,
    partialFilterExpression: { paid: false, paymentType: "online" },
  }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
