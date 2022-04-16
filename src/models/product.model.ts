import mongoose from "mongoose";

interface comments {
  title: string;
  body: string;
  rate: number;
  reactions: { likes: number; dislikes: number };
  username: string;
  avatar: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface productDocument extends mongoose.Document {
  name: string;
  brand: string;
  categories: mongoose.Types.ObjectId[];
  availability: boolean;
  number: number;
  price: number;
  discount: number;
  image: string;
  gallery: { filename: string; thumbnail: string }[];
  comments: comments[];
  rating: { rete: number; count: number };
  review: string;
  specification: { title: string; value: any[] }[];
  views: number;
  sales: number;
  createdAt: Date;
  updatedAt: Date;
}

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
    categories: { type: Array, required: true },
    availability: { type: Boolean, required: true },
    number: { type: Number, required: true },
    price: { type: Number, require: true },
    discount: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    gallery: { type: Array, required: true },
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
    views: { type: Number, required: true, default: 0 },
    sales: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
