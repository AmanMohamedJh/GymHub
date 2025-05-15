const express = require("express");
const requireAuth = require("../../middleware/requireAuth");
const adminControllers = require("../../controller/Admin/index");

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(requireAuth);

// Get all trainers with detailed information
router.get("/", adminControllers.getTrainersController);

// Update trainer status (pending/approved/rejected)
router.put("/:id/status", adminControllers.updateTrainerStatusController);

// Delete a trainer
router.delete("/:id", adminControllers.deleteTrainerController);

module.exports = router;
