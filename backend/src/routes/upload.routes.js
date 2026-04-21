const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

router.post("/upload", (req, res) => {
  upload.array("files", 10)(req, res, (err) => {
    if (err) {
      console.log("🔥 Multer/Cloudinary Error:", err);
      return res.status(500).json({ error: err.message });
    }

    try {
      console.log("🚀 Upload route hit");
      console.log("📦 req.files:", req.files);

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const fileUrls = req.files.map((file) => file.path);

      res.json({
        message: "Files uploaded successfully",
        files: fileUrls,
      });
    } catch (error) {
      console.log("🔥 Controller Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
});
module.exports = router;
