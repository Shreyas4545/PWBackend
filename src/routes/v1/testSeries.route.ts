import express from "express";
import {
  addTestSeries,
  addTests,
  getTestSeries,
  updateTestSections,
  updateTestSeries,
  updateTests,
} from "../../controllers/testSeries.controller";
import { isLoggedIn } from "../../middlewares/authorization";
const router = express.Router();

router.route("/addTestSeries").post(addTestSeries);
router.route("/updateTestSeries/:id").put(updateTestSeries);
router.route("/updateTestSections/:id").put(updateTestSections);
router.route("/updateTests/:id").put(updateTests);
router.route("/addTests").post(addTests);
router.route("/getTestSeries").get(getTestSeries);

export default router;
