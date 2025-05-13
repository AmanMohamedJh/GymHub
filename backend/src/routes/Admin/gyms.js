const express = require("express");
const requireAuth = require("../../middleware/requireAuth");
const adminControllers = require("../../controller/Admin/index");

const router = express.Router();

// Apply authentication middleware to all admin routes
// router.use(requireAuth);

// Get all gyms with detailed information
router.get("/", adminControllers.getGyms);

// Update gym profile (name, location)
router.put("/:id/profile", adminControllers.updateGymProfile);

// Update gym status (active/inactive)
router.put("/:id/status", adminControllers.updateGymStatus);

// Delete a gym
router.delete("/:id", adminControllers.deleteGym);

module.exports = router;
