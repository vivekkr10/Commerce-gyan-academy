import express from "express";
import {
  register,
  verifyOTPAndRegister,
  login,
  forgotPassword,
  resetPassword,
  verifyForgotOTP,
} from "../controllers/user.controller.js";

//Admin imports
import { superAdmin,verifyAdminOTPAndRegister } from "../controllers/admin.controller.js";

const router = express.Router();

router.post("/users/register", register); // sends OTP
router.post("/users/verify-otp", verifyOTPAndRegister);
router.post("/users/login", login); // login for every role
router.post("/users/forgot-password", forgotPassword); // send OTP
router.post("/users/verify-forgot-otp", verifyForgotOTP); // verify OTP
router.post("/users/reset-password", resetPassword); // set new password

// Admin routes
router.post("/users/super-admin", superAdmin);// sends otp for super admin
router.post("/users/verify-admin-Otp", verifyAdminOTPAndRegister);// sends otp for super admin

export default router;
