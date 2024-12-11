import express from "express";
import {
  addCurriculum,
  editLecture,
  editSection,
} from "../../controllers/curriculum.controller";

const router = express.Router();

router.route("/addCurriculum").post(addCurriculum);
router.route("/editSections").put(editSection);
router.route("/editLectures").put(editLecture);

export default router;
