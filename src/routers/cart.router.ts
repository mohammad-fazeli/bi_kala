import express from "express";
const router = express.Router();
import { isAuth, isAdmin } from "../utils/auth";
import validate from "../middleware/validateRequest";
import { updateItemSchema } from "../schemas/cart.schema";
import {
  addItem,
  updateItem,
  removeItem,
  getCart,
} from "../controller/cart.controller";
router.post("/:id", isAuth, addItem);
router.put("/", validate(updateItemSchema), isAuth, updateItem);
router.delete("/:id", isAuth, removeItem);
router.get("/", isAuth, getCart);

export default router;
