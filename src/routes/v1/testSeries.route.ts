import express from "express";
import {
  addTestSection,
  addTestSeries,
  addTests,
  getHomeTestSeries,
  getSingleTests,
  getTestInstructions,
  getTestSections,
  getTestSeries,
  getTests,
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
router.route("/getTests").get(getTests);
router.route("/getTestSeries").get(getTestSeries);
router.route("/getTestSections").get(getTestSections);
router.route("/getTestInstructions").get(getTestInstructions);
router.route("/getHomeTestSeries").get(getHomeTestSeries);
router.route("/getSingleTest").get(getSingleTests);
router.route("/addTestSection").post(addTestSection);

export default router;
