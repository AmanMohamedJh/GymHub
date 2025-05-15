const express = require("express");
const requireAuth = require("../../middleware/requireAuth");
const adminControllers = require("../../controller/Admin/index");

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(requireAuth);

// Get user profile by ID
router.get("/:id/profile", adminControllers.getUserProfileController);

// Update user profile by ID
router.put("/:id/profile", adminControllers.updateUserProfileController);

module.exports = router;
