const express = require("express");
const { addWorkoutLog,
    updateBMI,
    addFitnessGoal,
    getFitnessData

} = require("../controller/clientController");
const router = express.Router();

router.post("/addWorkout", addWorkoutLog);
router.patch("/updateBMI", updateBMI);
router.patch("/updateGoal", addFitnessGoal);
router.get("/getFitnessData/:id", getFitnessData);

module.exports = router;