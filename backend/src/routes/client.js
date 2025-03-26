const express = require("express");
const { addWorkoutLog, updateBMI } = require("../controller/clientController");
const router = express.Router();

router.post("/addWorkout", addWorkoutLog);
router.patch("/updateBMI", updateBMI);

module.exports = router;