import jwt from "jsonwebtoken";
import { UserDocument } from "../models/UserModel";

export const signToken = (user: UserDocument) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET || "JWT_SECRET",
    {
      expiresIn: "30d",
    }
  );
};
