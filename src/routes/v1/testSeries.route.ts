import express from "express";
import {
  addTestSeries,
  addTests,
  getTestSeries,
} from "../../controllers/testSeries.controller";
import { isLoggedIn } from "../../middlewares/authorization";
const router = express.Router();

router.route("/addTestSeries").post(addTestSeries);
router.route("/addTests").post(addTests);
router.route("/getTestSeries").get(getTestSeries);

export default router;
