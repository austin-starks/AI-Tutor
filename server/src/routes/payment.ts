import express from "express";
import paymentController from "../controller/paymentController";
import auth from "../middleware/auth";
const router = express.Router();

router.post("/submit", auth.isAuthorized, paymentController.submitPayment);

export default router;
