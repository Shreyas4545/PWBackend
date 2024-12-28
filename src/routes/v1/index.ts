import express from "express";
import authRoute from "./auth.route";
import filesRoute from "./files.route";
import courseRoute from "./course.route";
import courseCurriculum from "./courseCurriculum.route";
import testSeriesRoute from "./testSeries.route";
import coupanRoute from "./referral.route";

const router = express.Router();
/**
 * Endpoint: /api/v1
 */

router.use("/auth", authRoute);
router.use("/course", courseRoute);
router.use("/curriculum", courseCurriculum);
router.use("/assets", filesRoute);
router.use("/testSeries", testSeriesRoute);
router.use("/coupan", coupanRoute);

router.get("/", (req, res) => {
  return res.status(200).send({
    uptime: process.uptime(),
    message: "Vats's API health check :: GOOD",
    timestamp: Date.now(),
  });
});

export default router;
