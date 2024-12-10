import express from "express";
import {
  addCourse,
  getCourseId,
  updateCourse,
} from "../../controllers/course.controller";
const router = express.Router();

router.route("/addCourse").post(addCourse);
router.route("/updateCourse/:id").put(updateCourse);
router.route("/getCourseId").get(getCourseId);

export default router;
