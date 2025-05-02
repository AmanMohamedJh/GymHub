const express = require("express");
const router = express.Router();
const {
  createWorkoutPlan,
  getWorkoutPlans,
  deleteWorkoutPlan,
} = require("../../controller/Trainer/workoutPlanController");

// Routes for workout plans
router.post("/", createWorkoutPlan); // Create new workout plan
router.get("/:trainerId", getWorkoutPlans); // Get all workout plans by trainer
router.delete("/:id", deleteWorkoutPlan); // Delete workout plan

module.exports = router;
