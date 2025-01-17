import express from "express";
const router = express.Router();

import {
  addBanner,
  addNotification,
  getBanners,
  getNotifications,
  updateBanner,
} from "../../controllers/dashboard.controller";

import { isLoggedIn } from "../../middlewares/authorization";

router.route("/addNotification").post(addNotification);

router.route("/getNotification").get(getNotifications);

router.route("/addBanner").post(addBanner);

router.route("/getBanners").get(getBanners);

router.route("/updateBanner/:id").put(updateBanner);

export default router;
