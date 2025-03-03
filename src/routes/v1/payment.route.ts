import express from "express";
import {
  addPayment,
  getStudentsRegistered,
} from "../../controllers/payment.Controller";

const router = express.Router();

router.route("/addPayment").post(addPayment);
router.route("/getPayment").get(getStudentsRegistered);

export default router;
