import { Request, Response } from "express";
import User from "../models/user.model";
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

export async function addAddress(req: any, res: Response) {
  try {
    const address = {
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      alley: req.body.alley,
      HouseNumber: req.body.HouseNumber,
    };
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "کاربری یافت نشد" });
    }
    if (user.address.length >= 3) {
      return res
        .status(400)
        .json({ message: "شما تنها 3 آدرس را می توانید ثبت کنید" });
    }
    user.address.push(address);
    await user.save();
    res.status(200).json({ message: "آدرس با موفقیت ثبت شد" });
  } catch (err) {
    res.status(500).json({
      message: "خطایی در ثبت آدرس رخ داده است",
    });
  }
}

export async function updateAddress(req: any, res: Response) {
  const id = req.params.id;
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          "address.$[i].street": req.body.street,
          "address.$[i].city": req.body.city,
          "address.$[i].state": req.body.state,
          "address.$[i].alley": req.body.alley,
          "address.$[i].HouseNumber": req.body.HouseNumber,
        },
      },
      {
        arrayFilters: [{ "i._id": id }],
      }
    );
    if (!user) {
      return res.status(404).json({ message: "کاربری یافت نشد" });
    }

    res.status(200).json({ message: "آدرس با موفقیت بروز شد" });
  } catch (err) {
    res.status(500).json({
      message: "خطایی در ثبت آدرس رخ داده است",
    });
  }
}

export async function deleteAddress(req: any, res: Response) {
  const id = req.params.id;
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $pull: {
          address: { _id: id },
        },
      }
    );
    if (!user) {
      return res.status(404).json({ message: "کاربری یافت نشد" });
    }

    res.status(200).json({ message: "آدرس با موفقیت حذف شد" });
  } catch (err) {
    res.status(500).json({
      message: "خطایی در ثبت آدرس رخ داده است",
    });
  }
}
