import express from "express";
const router = express.Router();
import { isAuth, isAdmin } from "../utils/auth";
import validate from "../middleware/validateRequest";
import { addProductSchema } from "../schemas/product.schema";
import {
  addProduct,
  deleteProduct,
  updateProduct,
  getProduct,
} from "../controller/product.controller";

import multer from "multer";
const up = multer();

router.get("/:id", getProduct);
//An exception to this is route validation inside the controller due to the deletion of uploaded files in the event of a problem.
router.post("/", isAuth, isAdmin, addProduct);
router.put("/:id", isAuth, isAdmin, updateProduct);
router.delete("/:id", isAuth, isAdmin, deleteProduct);

router.post("/gallery", isAuth, isAdmin);
router.delete("/gallery", isAuth, isAdmin);

export default router;
