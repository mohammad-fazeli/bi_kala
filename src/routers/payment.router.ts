import express from "express";
const router = express.Router();
import validate from "../middleware/validateRequest";
import { startPay, setPayment } from "../controller/payment.controller";

router.get("/startPay/:token", startPay);
router.post("/setPayment", setPayment);

export default router;
