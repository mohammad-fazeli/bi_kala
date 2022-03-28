import { Request, Response } from "express";
import User from "../models/UserModel";
import { signToken } from "../utils/auth";

export async function signup(req: Request, res: Response) {
  try {
    const find = await User.findOne({ email: req.body.email });
    if (find) {
      return res.status(400).json({ message: "ایمیل وجود دارد" });
    }
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      isAdmin: false,
    });
    const user = await newUser.save();
    const token = signToken(user);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).send("oh");
  }
}

export async function login(req: Request, res: Response) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "کاربری یافت نشد" });
    }
    const isMatch = user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(400).json({ message: "رمز عبور اشتباه است" });
    }
    const token = signToken(user);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).send("oh");
  }
}
