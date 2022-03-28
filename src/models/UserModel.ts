import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre<UserDocument>("save", function (next) {
  if (!this.isModified("password")) next();

  this.password = bcrypt.hashSync(this.password);
  next();
});

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
