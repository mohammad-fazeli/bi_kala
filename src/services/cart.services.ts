import mongoose from "mongoose";
import User, { UserDocument } from "../models/user.model";
import Product from "./product.services";
class Cart {
  private userModel: mongoose.Model<UserDocument>;
  constructor(userModel: mongoose.Model<UserDocument>) {
    this.userModel = userModel;
  }
  async add(productId: string, userId: string) {
    const product = await Product.getOne(productId);
    if (!product) throw new Error("Product not found");
    if (!product.availability) throw new Error("Product not available");
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error("User not found");
    if (user.cart.some((item) => item.id === productId))
      throw new Error("Product already in cart");
    user.cart.push({
      id: productId,
      quantity: 1,
      price: product.price,
      discount: product.discount,
      image: product.image,
      name: product.name,
    });
    await user.save();
    return user.cart;
  }
  async update(productId: string, quantity: number, userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error("User not found");
    const index = user.cart.findIndex((item) => item.id === productId);
    if (index === -1) throw new Error("Product not found");
    const product = await Product.getOne(productId);
    if (!product) throw new Error("Product not found");
    if (!product.availability) throw new Error("Product not available");
    if (quantity > 0) {
      if (product.number < quantity) throw new Error("Product not available");
      user.cart[index].quantity = quantity;
      user.cart[index].price = product.price;
      user.cart[index].discount = product.discount;
      user.cart[index].image = product.image;
      user.cart[index].name = product.name;
    } else {
      user.cart.splice(index, 1);
    }
    await user.save();
    return user.cart;
  }
  async remove(productId: string, userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error("User not found");
    const index = user.cart.findIndex((item) => item.id === productId);
    if (index === -1) throw new Error("Product not found");
    user.cart.splice(index, 1);
    await user.save();
    return user.cart;
  }
  async get(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error("User not found");
    user.cart.forEach(async (item, index) => {
      const product = await Product.getOne(item.id);
      if (product) {
        if (!product.availability) {
          user.cart.splice(index, 1);
        } else {
          user.cart[index].price = product.price;
          user.cart[index].discount = product.discount;
          user.cart[index].image = product.image;
          user.cart[index].name = product.name;
        }
      }
    });
    await user.save();
    return user.cart;
  }
}

export default new Cart(User);
