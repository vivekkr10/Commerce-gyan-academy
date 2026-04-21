import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema(
  {
    // 🔗 Who created it
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔗 Subject (optional but recommended)
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
    },

    // 🔗 Class (important)
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classes",
      required: true,
    },

    // 📝 Homework Content
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String, // text homework
    },

    // 📎 File Upload (PDF/Image)
    fileUrl: {
      type: String, // stored file link (Cloudinary/S3/local)
    },

    fileType: {
      type: String,
      enum: ["pdf", "image", "text"],
      required: true,
    },

    // ⏳ Deadline
    dueDate: {
      type: Date,
    },

    // 🔐 Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Homework", homeworkSchema);
