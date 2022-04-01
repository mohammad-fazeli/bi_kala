import { Router } from "express";
import {
  signup,
  login,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controller/user.controller";
import validate from "../middleware/validateRequest";
import {
  createUserSchema,
  loginUserSchema,
  addAddressSchema,
} from "../schemas/user.schema";
import { isAuth } from "../utils/auth";

const router = Router();

router.post("/signup", validate(createUserSchema), signup);
router.post("/login", validate(loginUserSchema), login);
router.post("/address", isAuth, validate(addAddressSchema), addAddress);
router.put("/address/:id", isAuth, updateAddress);
router.delete("/address/:id", isAuth, deleteAddress);

export default router;
