import express from "express";
const router = express.Router();
import { isAuth, isAdmin } from "../utils/auth";
import validate from "../middleware/validateRequest";
import {
  addCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  getCategorySchema,
} from "../schemas/category.schema";
import {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategory,
} from "../controller/category.controller";

router.post("/", isAuth, isAdmin, validate(addCategorySchema), addCategory);
router.put(
  "/",
  isAuth,
  isAdmin,
  validate(updateCategorySchema),
  updateCategory
);
router.delete(
  "/",
  isAuth,
  isAdmin,
  validate(deleteCategorySchema),
  deleteCategory
);

router.get("/", getCategories);
router.get("/one/", validate(getCategorySchema), getCategory);

export default router;
