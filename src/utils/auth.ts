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
    process.env.JWT_SECRET as string,
    {
      expiresIn: "30d",
    }
  );
};
