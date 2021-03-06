import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  address: Array<{
    street: string;
    city: string;
    state: string;
    alley: string;
    HouseNumber: string;
  }>;
  cart: Array<{
    id: string;
    quantity: number;
    name: string;
    price: number;
    discount: number;
    image: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    address: {
      type: [
        {
          street: String,
          city: String,
          state: String,
          alley: String,
          HouseNumber: String,
        },
      ],
      required: true,
      default: [],
    },
    cart: {
      type: [
        {
          id: String,
          quantity: Number,
          name: String,
          price: Number,
          discount: Number,
          image: String,
        },
      ],
      required: true,
      default: [],
    },
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

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;
