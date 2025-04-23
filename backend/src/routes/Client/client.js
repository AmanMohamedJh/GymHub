const express = require("express");
const {
  addWorkoutLog,
  updateBMI,
  addFitnessGoal,
  getFitnessData,
  contactClientByEmail,
} = require("../../controller/Client/clientController");
const router = express.Router();

router.post("/addWorkout", addWorkoutLog);
router.patch("/updateBMI", updateBMI);
router.patch("/updateGoal", addFitnessGoal);
router.get("/getFitnessData/:id", getFitnessData);

// Add new route for contacting client via email
router.post("/contact", contactClientByEmail);

module.exports = router;
