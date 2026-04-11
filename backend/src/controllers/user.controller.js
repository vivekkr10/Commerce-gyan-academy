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
const allowedRoles = ["student", "teacher"];
// 1️⃣ REGISTER STEP (send OTP)
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const roleToSave = allowedRoles.includes(role) ? role : "student";
    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);

    // store temp user
    setTempUser(email, {
      name,
      email,
      password: hashedPassword,
      role: roleToSave,
      otp,
      expire: Date.now() + 5 * 60 * 1000, // 5 min
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
      role: tempUser.role,
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

    // get user with password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    // compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // update last login
    user.lastLogin = new Date();
    await user.save();

    // create token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "mysecret123",
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
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

  await User.findOneAndUpdate({ email }, { password: hashedPassword });

  deleteForgotOTP(email);

  res.json({ msg: "Password reset successful" });
};
