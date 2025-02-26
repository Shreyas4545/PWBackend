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
  getHomeCourses,
  getLectures,
  getLectureDetails,
  getAllTestsInCourse,
  updateLectures,
} from "../../controllers/course.controller";
const router = express.Router();
import { isLoggedIn } from "../../middlewares/authorization";

router.route("/addCourse").post(isLoggedIn, addCourse);
router.route("/updateCourse/:id").put(isLoggedIn, updateCourse);
router.route("/updateLectures/:id").put(isLoggedIn, updateLectures);
router.route("/getCourseId").get(isLoggedIn, getCourseId);
router.route("/getCourses").get(getCoursesWithSubjectsAndLectures);
router.route("/getHomeCourses").get(getHomeCourses);
router.route("/getSubjects").get(getSubjects);
router.route("/getGoogleMeetLink").post(getGoogleMeetLink);
router.route("/getFreeVideos").get(getFreeVideos);
router.route("/getLiveClasses").get(getLiveClasses);
router.route("/updateLiveClass/:id").put(updateLiveClass);
router.route("/getLectures").get(getLectures);
router.route("/getLectureDetails").get(getLectureDetails);
router.route("/getAllTestsInCourse").get(getAllTestsInCourse);
export default router;
