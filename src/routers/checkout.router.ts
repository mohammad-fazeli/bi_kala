import express from "express";
const router = express.Router();
import { isAuth } from "../utils/auth";
import validate from "../middleware/validateRequest";
import {
  checkout,
  verifyRequest,
  changePayment,
  retryPayment,
  cancelOrder,
} from "../controller/checkout.controller";

router.post("/", isAuth, checkout);
router.get("/verify/:orderId", isAuth, verifyRequest);
router.post("/changepayment/:orderId", isAuth, changePayment);
router.post("/retry/:orderId", isAuth, retryPayment);
router.post("/cancel/:orderId", isAuth, cancelOrder);

export default router;
