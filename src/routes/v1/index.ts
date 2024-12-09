import express from "express";
import { sendSuccessApiResponse } from "../../middlewares/successApiResponse";
import authRoute from "./auth.route";
import filesRoute from "./files.route";

const router = express.Router();
/**
 * Endpoint: /api/v1
 */

router.use("/auth", authRoute);
// router.use("/course",);

router.use("/assets", filesRoute);

router.get("/", (req, res) => {
  return res.status(200).send({
    uptime: process.uptime(),
    message: "Vats's API health check :: GOOD",
    timestamp: Date.now(),
  });
});

export default router;
