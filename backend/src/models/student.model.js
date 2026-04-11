const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // Basic Info
    rollNumber: {
      type: String,
      required: true,
      unique: true,
    },

    // Personal Info
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    address: {
      city: String,
      state: String,
      pincode: String,
    },

    // Academic Info 🎓
    course: {
      type: String,
      required: true,
    },
    batch: String,
    admissionDate: {
      type: Date,
      default: Date.now,
    },

    // Fees 💰
    totalFees: {
      type: Number,
      // required: true,
    },
    feesPaid: {
      type: Number,
      default: 0,
    },
    feesDue: {
      type: Number,
      default: function () {
        if (this.totalFees != null) {
          return this.totalFees - (this.feesPaid || 0);
        }
        return 0;
      },
    },

    // Optional Login System 🔐
    password: String,
    isActive: {
      type: Boolean,
      default: true,
    },

    // 📊 Weekly Test Scores` 
    testScores: [
      {
        subject: String,
        marks: Number,
        totalMarks: Number,
        testDate: {
          type: Date,
          default: Date.now,
        },
        teacher: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Teacher",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Student", studentSchema);
