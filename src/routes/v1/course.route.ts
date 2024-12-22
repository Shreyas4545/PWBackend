import express from "express";
import {
  addCourse,
  getCourseId,
  updateCourse,
  getCoursesWithSubjectsAndLectures,
} from "../../controllers/course.controller";
const router = express.Router();
import { isLoggedIn } from "../../middlewares/authorization";

router.route("/addCourse").post(isLoggedIn, addCourse);
router.route("/updateCourse/:id").put(isLoggedIn, updateCourse);
router.route("/getCourseId").get(isLoggedIn, getCourseId);
router.route("/getCourses").get(getCoursesWithSubjectsAndLectures);
export default router;
