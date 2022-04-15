import mongoose from "mongoose";
import UserModel, { UserDocument } from "../models/user.model";

class User {
  private userModel: mongoose.Model<UserDocument>;
  constructor(userModel: mongoose.Model<UserDocument>) {
    this.userModel = userModel;
  }
  async create(user: { name: string; email: string; password: string }) {
    const newUser = new this.userModel({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    return await newUser.save();
  }
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      return null;
    }
    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      return null;
    }
    return user;
  }
  async addAddress(userId: string, address: any) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      return null;
    }
    if (user.address.length >= 3) {
      return null;
    }
    user.address.push(address);
    await user.save();
    return user;
  }
  async updateAddress(userId: string, addressId: string, address: any) {
    const user = await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          "address.$[i].street": address.street,
          "address.$[i].city": address.city,
          "address.$[i].state": address.state,
          "address.$[i].alley": address.alley,
          "address.$[i].HouseNumber": address.HouseNumber,
        },
      },
      {
        arrayFilters: [{ "i._id": addressId }],
      }
    );
    return user;
  }
  async deleteAddress(userId: string, addressId: string) {
    const user = await this.userModel.findOneAndUpdate(
      { _id: userId },
      {
        $pull: {
          address: { _id: addressId },
        },
      }
    );
    return user;
  }
}

export default new User(UserModel);
