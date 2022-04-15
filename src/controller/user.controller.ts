import { Request, Response } from "express";
import User from "../services/user.services";
import { signToken } from "../utils/auth";

export async function signup(req: Request, res: Response) {
  try {
    const user = await User.create(req.body);
    const token = signToken(user);
    res.status(201).json({ token });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "ایمیل قبلا ثبت شده است",
      });
    }
    res.status(500).json({ message: "مشکلی در سرور به وجود آمده است" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const user = await User.login(req.body.email, req.body.password);
    if (!user) {
      return res
        .status(400)
        .json({ message: "نام کاربری یا رمز عبور اشتباه است" });
    }
    const token = signToken(user);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "مشکلی در سرور به وجود آمده است" });
  }
}

export async function addAddress(req: any, res: Response) {
  try {
    const address = {
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      alley: req.body.alley,
      HouseNumber: req.body.HouseNumber,
    };
    const user = await User.addAddress(req.user._id, address);
    if (!user) {
      return res.status(400).json({ message: "خظایی در ثبت آدرس رخ داده است" });
    }
    res.status(200).json({ message: "آدرس با موفقیت ثبت شد" });
  } catch (err) {
    res.status(500).json({ message: "مشکلی در سرور به وجود آمده است" });
  }
}

export async function updateAddress(req: any, res: Response) {
  const id = req.params.id;
  try {
    const user = await User.updateAddress(req.user._id, id, req.body);
    if (!user) {
      return res
        .status(400)
        .json({ message: "خطایی در بروزرسانی آدرس رخ داده است" });
    }

    res.status(200).json({ message: "آدرس با موفقیت بروز شد" });
  } catch (err) {
    res.status(500).json({ message: "مشکلی در سرور به وجود آمده است" });
  }
}

export async function deleteAddress(req: any, res: Response) {
  try {
    const user = await User.deleteAddress(req.user._id, req.params.id);
    if (!user) {
      return res.status(400).json({ message: "خطایی در حذف آدرس رخ داده است" });
    }
    res.status(200).json({ message: "آدرس با موفقیت حذف شد" });
  } catch (err) {
    res.status(500).json({ message: "مشکلی در سرور به وجود آمده است" });
  }
}
