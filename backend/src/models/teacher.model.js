import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    // 🔗 Link with User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 👤 Basic Info
    subject: {
      type: String,
      required: true,
    },
    qualification: String,
    experience: {
      type: Number, // in years
      default: 0,
    },

    bio: String,

    // 📚 Classes / Courses
    courses: [
      {
        type: String, // e.g. "BCA", "MCA"
      },
    ],

    // 📝 Homework
    homework: [
      {
        title: String,
        description: String,
        dueDate: Date,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // 📄 Notes Upload
    notes: [
      {
        title: String,
        fileUrl: String, // PDF/image link
        description: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // 🔐 Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Teacher", teacherSchema);