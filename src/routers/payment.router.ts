import express from "express";
const router = express.Router();
import validate from "../middleware/validateRequest";
import { startPay, setPayment } from "../controller/payment.controller";
import { setPaymentSchema } from "../schemas/payment.schema";

router.get("/startPay/:token", validate(setPaymentSchema), startPay);
router.post("/setPayment", setPayment);

export default router;
