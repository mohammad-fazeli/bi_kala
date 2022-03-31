import express from "express";
const router = express.Router();
import { isAuth, isAdmin } from "../utils/auth";
import validate from "../middleware/validateRequest";
import { addFilterSchema } from "../schemas/filter.schema";
import {
  addFilter,
  updateFilter,
  deleteFilter,
} from "../controller/filter.controller";

router.post("/", isAuth, isAdmin, validate(addFilterSchema), addFilter);
router.put("/", isAuth, isAdmin, updateFilter);
router.delete("/:id", isAuth, isAdmin, deleteFilter);

export default router;
