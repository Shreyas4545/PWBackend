import express from "express";
import {
  addCurriculum,
  addLecture,
  addSection,
  editCurriculum,
  editLecture,
  editSection,
} from "../../controllers/curriculum.controller";
import { isLoggedIn } from "../../middlewares/authorization";

const router = express.Router();

router.route("/addCurriculum").post(isLoggedIn, addCurriculum);
router.route("/editCurriculum").post(isLoggedIn, editCurriculum);
router.route("/editSections/:id").put(isLoggedIn, editSection);
router.route("/editLectures/:id").put(isLoggedIn, editLecture);
router.route("/addSubject").post(isLoggedIn, addSection);
router.route("/addLecture").post(isLoggedIn, addLecture);
export default router;
