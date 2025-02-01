import express from "express";
import {
  addCourse,
  getCourseId,
  updateCourse,
  getCoursesWithSubjectsAndLectures,
  getGoogleMeetLink,
  getFreeVideos,
  getSubjects,
  getLiveClasses,
  updateLiveClass,
} from "../../controllers/course.controller";
const router = express.Router();
import { isLoggedIn } from "../../middlewares/authorization";

router.route("/addCourse").post(isLoggedIn, addCourse);
router.route("/updateCourse/:id").put(isLoggedIn, updateCourse);
router.route("/getCourseId").get(isLoggedIn, getCourseId);
router.route("/getCourses").get(getCoursesWithSubjectsAndLectures);
router.route("/getSubjects").get(getSubjects);
router.route("/getGoogleMeetLink").post(getGoogleMeetLink);
router.route("/getFreeVideos").get(getFreeVideos);
router.route("/getLiveClasses").get(getLiveClasses);
router.route("/updateLiveClass/:id").put(updateLiveClass);
export default router;
