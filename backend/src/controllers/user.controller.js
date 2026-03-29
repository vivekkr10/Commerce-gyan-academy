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

// generate OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// 1️⃣ REGISTER STEP (send OTP)
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);

    // store temp user
    setTempUser(email, {
      name,
      email,
      password: hashedPassword,
      otp,
    });

    await sendOTPEmail(email, otp);

    res.json({ msg: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

// 2️⃣ VERIFY OTP + FINAL REGISTER
export const verifyOTPAndRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const tempUser = getTempUser(email);

    if (!tempUser) {
      return res.status(400).json({ msg: "No registration request found" });
    }

    if (tempUser.expire < Date.now()) {
      deleteTempUser(email);
      return res.status(400).json({ msg: "OTP expired" });
    }

    if (tempUser.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // create real user
    const user = new User({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
    });

    await user.save();

    deleteTempUser(email);

    res.json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

// LOGIN (same)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      "mysecret123", 
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};


//----------------forgot password (send OTP)----------
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }

  const otp = generateOTP();

  setForgotOTP(email, otp);
  await sendOTPEmail(email, otp);

  res.json({ msg: "OTP sent" });
};


export const verifyForgotOTP = async (req, res) => {
  const { email, otp } = req.body;

  const stored = getForgotOTP(email);

  if (!stored) {
    return res.status(400).json({ msg: "OTP not found" });
  }

  if (stored.expire < Date.now()) {
    deleteForgotOTP(email);
    return res.status(400).json({ msg: "OTP expired" });
  }

  if (stored.otp !== otp) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  markVerified(email);

  res.json({ msg: "OTP verified successfully" });
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const stored = getForgotOTP(email);

  if (!stored || !stored.verified) {
    return res.status(400).json({ msg: "OTP not verified" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.findOneAndUpdate(
    { email },
    { password: hashedPassword }
  );

  deleteForgotOTP(email);

  res.json({ msg: "Password reset successful" });
};