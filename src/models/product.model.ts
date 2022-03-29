import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    rate: { type: Number, required: true },
    reactions: { type: { likes: Number, dislikes: Number }, required: true },
    username: { type: String, required: true },
    avatar: { type: String },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: Array, required: true },
    availability: { type: Boolean, required: true },
    number: { type: Number, required: true },
    price: { type: Number, require: true },
    discount: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    images: { type: Array, required: true },
    comments: { type: [commentSchema], required: true, default: [] },
    rating: {
      type: {
        rete: { type: Number, required: true },
        count: { type: Number, required: true },
      },
      required: true,
      default: { rete: -1, count: 0 },
    },
    review: { type: String },
    specification: {
      type: [{ title: { type: String }, value: { type: Array } }],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
