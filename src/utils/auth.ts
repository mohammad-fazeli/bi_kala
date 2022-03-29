import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserDocument } from "../models/user.model";

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

export const isAuth = (req: any, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({
      message: "Token is not supplied",
    });
  }
  jwt.verify(
    authorization,
    process.env.JWT_SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(401).send({
          message: "Invalid Token",
        });
      }
      req.user = decoded as jwt.JwtPayload;
      next();
    }
  );
};

export const isAdmin = (req: any, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(401).send({
      message: "You are not authorized to perform this action",
    });
  }
  next();
};
