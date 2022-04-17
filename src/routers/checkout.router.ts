import express from "express";
const router = express.Router();
import { isAuth } from "../utils/auth";
import validate from "../middleware/validateRequest";
import { checkout, verify } from "../controller/checkout.controller";
import { checkoutSchema } from "../schemas/checkout.schema";

router.post("/", isAuth, validate(checkoutSchema), checkout);
router.post("/:orderId", verify);
