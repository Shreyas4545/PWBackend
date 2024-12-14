import express from "express";
import {
  addCurriculum,
  editLecture,
  editSection,
} from "../../controllers/curriculum.controller";
import { isLoggedIn } from "../../middlewares/authorization";

const router = express.Router();

router.route("/addCurriculum").post(isLoggedIn, addCurriculum);
router.route("/editSections/:id").put(isLoggedIn, editSection);
router.route("/editLectures/:id").put(isLoggedIn, editLecture);

export default router;
