const express = require("express");
const router = express.Router();
const {
  registerGym,
  getOwnerGyms,
  getNearbyGyms,
  updateGym,
  deleteGym,
  updateGymStatus,
  getPendingGyms,
  getAllGyms,
  getGymById,
  getPublicGymById,
} = require("../../controller/Gym_Owner/gymController");
const requireAuth = require("../../middleware/requireAuth");
const upload = require("../../middleware/upload");

// Only apply authentication middleware to protected routes, not public ones

// Configure multer for different file types
const uploadFields = upload.fields([
  { name: "gymImages", maxCount: 5 },
  { name: "certificate", maxCount: 1 },
]);

// Routes
router.post("/register", requireAuth, uploadFields, registerGym);
router.get("/owner-gyms", requireAuth, getOwnerGyms);
router.get("/nearby", requireAuth, getNearbyGyms);

// Public route for all gyms (for BrowseGym)
router.get("/getALlgym", getAllGyms);
router.patch("/:id", requireAuth, uploadFields, updateGym);
router.delete("/:id", requireAuth, deleteGym);

// Get a gym by ID (for ManageGym page)
router.get("/:gymId", requireAuth, getGymById);

// Public gym details for advertising mainly used in the SeeGymDetails.jsx so that everyone can see the gym details
router.get("/public/:gymId", getPublicGymById);

// Admin routes
router.get("/pending", requireAuth, getPendingGyms);
router.patch("/:gymId/status", requireAuth, updateGymStatus);

module.exports = router;
