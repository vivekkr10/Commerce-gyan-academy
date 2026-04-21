const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

console.log("Multer file loaded ✅");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log("📁 File received:");
    console.log("Original name:", file.originalname);
    console.log("Mimetype:", file.mimetype);

    let folder = "uploads";

    if (file.mimetype === "application/pdf") {
      folder = "notes/pdfs";
    } else if (file.mimetype.startsWith("image")) {
      folder = "notes/images";
    }

    console.log("📂 Uploading to folder:", folder);

    return {
      folder: folder,
      resource_type: "auto",
    };
  },
});

const upload = multer({ storage });

console.log("Multer configured ✅");

module.exports = upload;