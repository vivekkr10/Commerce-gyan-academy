import Homework from "../models/homework.model.js";
import upload from "../config/multer.js";

export const uploadHomework = async (req, res) => {
  upload.array("files", 10)(req, res, async (err) => {
    if (err) {
      console.log("🔥 Multer/Cloudinary Error:", err);
      return res.status(500).json({ error: err.message });
    }

    try {
      console.log("🚀 Upload Homework Hit");

      // ❌ No files
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      // ✅ Extract file URLs
      const fileUrls = req.files.map((file) => file.path);

      console.log("📂 Uploaded Files:", fileUrls);

      // ✅ Detect file type (simple logic)
      let fileType = "text";

      if (req.files.some((file) => file.mimetype === "application/pdf")) {
        fileType = "pdf";
      } else if (req.files.some((file) => file.mimetype.startsWith("image"))) {
        fileType = "image";
      }

      // ✅ Create Homework
      const homework = await Homework.create({
        teacher: req.user?.id || req.body.teacher, // from auth OR body
        subject: req.body.subject,
        class: req.body.class,
        title: req.body.title,
        description: req.body.description,
        fileUrl: fileUrls[0], // 🔥 if single file needed
        // OR store multiple:
        // fileUrls: fileUrls,
        fileType: fileType,
        dueDate: req.body.dueDate,
      });

      console.log("✅ Homework Saved:", homework);

      res.status(201).json({
        message: "Homework uploaded successfully",
        homework,
      });
    } catch (error) {
      console.log("🔥 Controller Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
};

export const deleteHomework = async (req, res) => {
  try {
    const { id } = req.params;
    const homework = await Homework.findById(id);

    if (!homework) {
      return res.status(404).json({ message: "Homework not found" });
    }
    await Homework.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Homework Deleted",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
