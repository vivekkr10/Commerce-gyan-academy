import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // 🔥 security: not returned by default
    },

    role: {
      type: String,
      enum: ["student", "teacher", "admin", "super_admin"],
      default: "student",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    avatar: {
      type: String, // URL or path
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    // 🔥 optional: role-based extra info
    teacherInfo: {
      subject: String,
      experience: Number,
    },

    studentInfo: {
      grade: String,
    },
  },
  {
    timestamps: true, // 🔥 createdAt, updatedAt
  },
);

export default mongoose.model("User", userSchema);
