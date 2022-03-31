import express from "express";
const router = express.Router();
import { isAuth, isAdmin } from "../utils/auth";
import {
  addProduct,
  deleteProduct,
  updateProduct,
  getProduct,
  addImage,
  deleteImage,
} from "../controller/product.controller";

router.get("/:id", getProduct);
//An exception to this is route validation inside the controller due to the deletion of uploaded files in the event of a problem.
router.post("/", isAuth, isAdmin, addProduct);
router.put("/:id", isAuth, isAdmin, updateProduct);
router.delete("/:id", isAuth, isAdmin, deleteProduct);

router.post("/gallery/:id", isAuth, isAdmin, addImage);
router.delete("/gallery/:id", isAuth, isAdmin, deleteImage);

export default router;
