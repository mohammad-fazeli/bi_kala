import mongoose from "mongoose";

export default async function connect<Promise>() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/online-shop"
    );
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  } catch (err) {
    return new Promise<void>((resolve, reject) => {
      reject(err);
    });
  }
}
