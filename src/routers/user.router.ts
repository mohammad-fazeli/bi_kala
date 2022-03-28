import { Router } from "express";
import { signup, login } from "../controller/user.controller";
import validate from "../middleware/validateRequest";
import { createUserSchema, loginUserSchema } from "../schemas/user.schema";

const router = Router();

router.post("/signup", validate(createUserSchema), signup);
router.post("/login", validate(loginUserSchema), login);

export default router;
