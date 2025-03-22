const express = require("express");
const router = express.Router();
const {
  loginUser,
  signupUser,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  deleteUserAccount,
  sendVerificationCode,
  verifyEmail,
  verifyToken,
} = require("../controller/userController");
const requireAuth = require("../middleware/requireAuth");
const upload = require("../middleware/upload");

// Auth routes
router.post("/login", loginUser);
router.post("/signup", signupUser);

// Email verification routes
router.post("/send-verification", requireAuth, sendVerificationCode);
router.post("/verify-email", requireAuth, verifyEmail);

// Protected routes
router.use(requireAuth);
router.get("/profile", getUserProfile);
router.get("/verify-token", verifyToken);
router.patch("/profile", upload.single("profilePicture"), updateUserProfile);
router.post("/update-password", updatePassword);
router.delete("/profile", deleteUserAccount);

module.exports = router;
