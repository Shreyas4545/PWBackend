import express from "express";
import {
  addCoupan,
  getCoupan,
  updateCoupan,
} from "../../controllers/referral.controller";

const router = express.Router();

router.route("/addCoupan").post(addCoupan);
router.route("/getCoupan").get(getCoupan);
router.route("/updateCoupan/:id").put(updateCoupan);

export default router;
