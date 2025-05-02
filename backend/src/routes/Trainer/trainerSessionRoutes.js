const express = require("express");
const { getTrainerSessions, createTrainerSession, deleteTrainerSession } = require("../../controller/Trainer/TrainerSessionController");

const router = express.Router();

router.get("/", getTrainerSessions);
router.post("/", createTrainerSession);
router.delete("/:id", deleteTrainerSession);

module.exports = router;
