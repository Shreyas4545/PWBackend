import express from "express";
import {
  addCourse,
  getCourseId,
  updateCourse,
} from "../../controllers/course.controller";
const router = express.Router();
import { isLoggedIn } from "../../middlewares/authorization";

router.route("/addCourse").post(isLoggedIn, addCourse);
router.route("/updateCourse/:id").put(isLoggedIn, updateCourse);
router.route("/getCourseId").get(isLoggedIn, getCourseId);

export default router;
