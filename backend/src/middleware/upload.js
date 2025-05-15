const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    "uploads/profiles",
    "uploads/Gym_images",
    "uploads/Gym_certificates",
    "uploads/Trainer_certificates",
    "uploads/Gym_ads",
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "uploads/profiles/"; // default path

    if (file.fieldname === "gymImages") {
      uploadPath = "uploads/Gym_images/";
    } else if (file.fieldname === "certificate") {
      // If this is for trainer registration, use Trainer_certificates
      if (req.baseUrl && req.baseUrl.includes("trainer/registration")) {
        uploadPath = "uploads/Trainer_certificates/";
      } else {
        uploadPath = "uploads/Gym_certificates/";
      }
    } else if (file.fieldname === "adImage") {
      uploadPath = "uploads/Gym_ads/";
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

module.exports = upload;
