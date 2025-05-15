const express = require("express");
const {
  addWorkoutLog,
  updateBMI,
  addFitnessGoal,
  getFitnessData,
  contactClientByEmail,
  registerClient,
  checkClientProfile

} = require("../../controller/Client/clientController");
const router = express.Router();
const requireAuth = require('../../middleware/requireAuth');

router.post("/registerClient", requireAuth, registerClient);
router.post("/addWorkout", addWorkoutLog);
router.patch("/updateBMI", updateBMI);
router.patch("/updateGoal", addFitnessGoal);
router.get("/getFitnessData/:id", getFitnessData);
router.get('/check-profile', requireAuth, checkClientProfile);

// Add new route for contacting client via email
router.post("/contact", contactClientByEmail);

module.exports = router;
