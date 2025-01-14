import express from "express";
const router = express.Router();

import {
  addBanner,
  addNotification,
  getBanners,
  getNotifications,
} from "../../controllers/dashboard.controller";

import { isLoggedIn } from "../../middlewares/authorization";

router.route("/addNotification").post(addNotification);

router.route("/getNotification").get(getNotifications);

router.route("/addBanner").post(addBanner);

router.route("/getBanners").get(getBanners);

export default router;
