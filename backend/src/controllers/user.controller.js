import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
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
  console.log("📩 Register API hit");

  try {
    const { name, email, password, role } = req.body;

    console.log("📦 Incoming Data:", { name, email, role });

    if (!name || !email || !password) {
      console.log("❌ Missing fields");
      return res.status(400).json({ msg: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    console.log(
      "🔍 Checking existing user:",
      existingUser ? "FOUND" : "NOT FOUND",
    );

    if (existingUser) {
      console.log("⚠️ User already exists:", email);
      return res.status(400).json({ msg: "User already exists" });
    }

    const roleToSave = allowedRoles.includes(role) ? role : "student";
    console.log("👤 Role assigned:", roleToSave);

    const otp = generateOTP();
    console.log("🔢 Generated OTP:", otp);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Password hashed");

    // store temp user
    setTempUser(email, {
      name,
      email,
      password: hashedPassword,
      role: roleToSave,
      otp,
      expire: Date.now() + 5 * 60 * 1000,
    });

    console.log("💾 Temp user stored in memory");
    console.log("⏳ OTP expiry set to:", new Date(Date.now() + 5 * 60 * 1000));

    await sendOTPEmail(email, otp);
    console.log("📧 OTP email sent to:", email);

    res.json({ msg: "OTP sent to email" });
  } catch (err) {
    console.error("🔥 Register Error:", err.message);
    res.status(500).json({ err: err.message });
  }
};
// 2️⃣ VERIFY OTP + FINAL REGISTER
export const verifyOTPAndRegister = async (req, res) => {
  console.log("✅ Verify OTP API hit");

  try {
    const { email, otp } = req.body;

    console.log("📩 Incoming Data:", { email, otp });

    const tempUser = getTempUser(email);
    console.log("📦 Temp user fetched:", tempUser ? "FOUND" : "NOT FOUND");

    if (!tempUser) {
      console.log("❌ No temp user found for:", email);
      return res.status(400).json({ msg: "No registration request found" });
    }

    console.log("⏳ Stored expiry:", new Date(tempUser.expire));
    console.log("🕒 Current time:", new Date());

    if (tempUser.expire < Date.now()) {
      console.log("⌛ OTP expired");
      deleteTempUser(email);
      return res.status(400).json({ msg: "OTP expired" });
    }

    console.log("🔢 Stored OTP:", tempUser.otp);
    console.log("🔢 Entered OTP:", otp);

    if (tempUser.otp !== otp) {
      console.log("❌ OTP mismatch");
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    console.log("✅ OTP verified successfully");

    // create real user
    const user = new User({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      role: tempUser.role,
    });

    console.log("🛠 Creating new user:", user.email);

    await user.save();
    console.log("💾 User saved in DB with ID:", user._id);

    deleteTempUser(email);
    console.log("🧹 Temp user deleted after success");

    res.json({ msg: "User registered successfully" });
  } catch (err) {
    console.error("🔥 Verify OTP Error:", err.message);
    res.status(500).json({ err: err.message });
  }
};

// LOGIN (same)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("BODY:", req.body);
    console.log("PARAMS:", req.params);
    console.log("QUERY:", req.query);
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
      config.JWT_SECRET,
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
