import express from "express";
import {
  register,
  verifyOTPAndRegister,
  login,
  forgotPassword,
  resetPassword,
  verifyForgotOTP,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", register); // sends OTP
router.post("/verify-otp", verifyOTPAndRegister);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);     // send OTP
router.post("/verify-forgot-otp", verifyForgotOTP);  // verify OTP
router.post("/reset-password", resetPassword);       // set new password

export default router;