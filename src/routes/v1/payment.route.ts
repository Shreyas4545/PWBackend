import express from "express";
import { addPayment } from "../../controllers/payment.Controller";

const router = express.Router();

router.route("/addPayment").post(addPayment);

export default router;
