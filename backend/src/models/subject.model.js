import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    subjectName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Subject", subjectSchema);
