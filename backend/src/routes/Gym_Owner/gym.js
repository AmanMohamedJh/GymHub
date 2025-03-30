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
} = require("../../controller/Gym_Owner/gymController");
const requireAuth = require("../../middleware/requireAuth");
const upload = require("../../middleware/upload");

// Apply authentication middleware to all routes
router.use(requireAuth);

// Configure multer for different file types
const uploadFields = upload.fields([
  { name: "gymImages", maxCount: 5 },
  { name: "certificate", maxCount: 1 },
]);

// Routes
router.post("/register", uploadFields, registerGym);
router.get("/owner-gyms", getOwnerGyms);
router.get("/nearby", getNearbyGyms);
router.patch("/:id", uploadFields, updateGym);
router.delete("/:id", deleteGym);

// Admin routes
router.get("/pending", getPendingGyms);
router.patch("/:gymId/status", updateGymStatus);

module.exports = router;
