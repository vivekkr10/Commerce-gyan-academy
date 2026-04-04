import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../services/mail.service.js";

import {
  setTempUser,
  getTempUser,
  deleteTempUser,
} from "../utils/tempUserStore.js";
import {
  setForgotOTP,
  getForgotOTP,
  deleteForgotOTP,
  markVerified,
} from "../utils/forgotOTPStore.js";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const superAdmin = async (req, res) => {
  try {
    const { name, email, password, secretKey } = req.body;
    if (secretKey.trim() !== process.env.SUPER_ADMIN_SECRET.trim()) {
      return res.status(403).json({ message: "Invalid Secret Key" });
    }
    if (!secretKey) {
      return res.status(400).json({ message: "Secret Key is required." });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res
        .status(400)
        .json({ message: "User already exist with this email." });
    }
    const otp = generateOTP();
    console.log("Generated Otp: ", otp);
    const hashedPassword = await hashPassword(password);

    setTempUser(email, {
      name,
      email,
      password: hashedPassword,
      role: "super_admin",
      otp,
    });
    await sendOTPEmail(email, otp);
    return res.status(200).json({ message: "Otp sent to your email." });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

export const verifyAdminOTPAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const tempUser = getTempUser(email);

    if (!tempUser) {
      return res.status(404).json({ message: "No registration request found" });
    }

    if (tempUser.expire < Date.now()) {
      deleteTempUser(email);
      return res.status(410).json({ message: "OTP expired" });
    }

    if (tempUser.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // extra safety check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      deleteTempUser(email);
      return res.status(409).json({ message: "User already exists" });
    }

    // create real user
    const user = new User({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      role: tempUser.role, // ✅ IMPORTANT FIX
    });

    await user.save();

    deleteTempUser(email);

    return res.status(201).json({
      success: true,
      message: "Super admin registered successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
