import express from "express";
const router = express.Router();

import {
  addBanner,
  addFreeVideos,
  getFreeVideos,
  addNotification,
  addReviews,
  addStudentQueries,
  getBanners,
  getDashboardData,
  getNotifications,
  getReviews,
  getStudentQueries,
  updateBanner,
  updateReviews,
} from "../../controllers/dashboard.controller";

import { isLoggedIn } from "../../middlewares/authorization";

router.route("/addNotification").post(addNotification);

router.route("/addQuery").post(addStudentQueries);
router.route("/getQueries").get(getStudentQueries);

router.route("/addReview").post(addReviews);
router.route("/getReviews").get(getReviews);

router.route("/addFreeVideos").post(addFreeVideos);
router.route("/getFreeVideos").get(getFreeVideos);
router.route("/updateReview/:id").put(updateReviews);

router.route("/getNotification").get(getNotifications);

router.route("/addBanner").post(addBanner);

router.route("/getBanners").get(getBanners);

router.route("/updateBanner/:id").put(updateBanner);

router.route("/DashboardData").get(getDashboardData);

export default router;
