import express from "express";
const router = express.Router();

// import controllers
import {
  signup,
  login,
  logout,
  refreshToken,
  getUsers,
  studentSignup,
  studentLogin,
  getStudents,
  updateStudentDetails,
  sendOtp,
  verifyOtp,
  updateUserDetails,
} from "../../controllers/auth.controller";

// import middlwares
import { isLoggedIn } from "../../middlewares/authorization";

router.route("/refresh-token").get(refreshToken);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/studentSignup").post(studentSignup);
router.route("/studentLogin").post(studentLogin);
router.route("/logout").get(logout);
router.route("/updateUserDetails/:id").put(updateUserDetails);
router.route("/getUsers").get(getUsers);
router.route("/getStudents").get(getStudents);
router.route("/sendOtp").post(sendOtp);
router.route("/verifyOtp").post(verifyOtp);
router.route("/updateStudentDetails/:id").put(updateStudentDetails);

export default router;
