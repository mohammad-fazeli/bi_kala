import express from "express";
import upload from "../middleware/uploadFiles";
import validate from "../middleware/validateRequest";
import { isAuth, isAdmin } from "../utils/auth";
import {
  addProduct,
  deleteProduct,
  updateProduct,
  getProduct,
  getProducts,
  addImage,
  deleteImage,
} from "../controller/product.controller";
import {
  addProductSchema,
  addImageSchema,
  getProductSchema,
  deleteImageSchema,
} from "../schemas/product.schema";

const router = express.Router();

router.get("/:id", getProduct);
router.get("/", validate(getProductSchema), getProducts);
router.post(
  "/",
  isAuth,
  isAdmin,
  upload([
    { name: "gallery", maxCount: 5 },
    { name: "image", maxCount: 1 },
  ]),
  validate(addProductSchema),
  addProduct
);
router.put(
  "/:id",
  isAuth,
  isAdmin,
  upload([{ name: "image", maxCount: 1 }]),
  updateProduct
);
router.delete("/:id", isAuth, isAdmin, deleteProduct);
router.post(
  "/gallery/:id",
  isAuth,
  isAdmin,
  upload([{ name: "gallery", maxCount: 1 }]),
  validate(addImageSchema),
  addImage
);
router.delete(
  "/gallery/:id",
  isAuth,
  isAdmin,
  validate(deleteImageSchema),
  deleteImage
);

export default router;
