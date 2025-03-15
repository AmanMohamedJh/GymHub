const express = require("express");
const router = express.Router();
const {
  loginUser,
  signupUser,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  deleteUserAccount,
} = require("../controller/userController");
const requireAuth = require("../middleware/requireAuth");

// Auth routes
router.post("/login", loginUser);
router.post("/signup", signupUser);

// Protected routes
router.use(requireAuth);
router.get("/profile", getUserProfile);
router.patch("/profile", updateUserProfile);
router.post("/update-password", updatePassword);
router.delete("/profile", deleteUserAccount);

module.exports = router;
