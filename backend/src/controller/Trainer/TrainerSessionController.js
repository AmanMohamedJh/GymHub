const TrainerSession = require("../../models/Trainer/TrainerSession");
// Get all sessions
const getTrainerSessions = async (req, res) => {
  try {
    const sessions = await TrainerSession.find();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve sessions" });
  }
};

// Create a new session
const createTrainerSession = async (req, res) => {
  try {
    const { trainerName, day, time, payment, description } = req.body;
    const newSession = new TrainerSession({ trainerName, day, time, payment, description });
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    res.status(400).json({ error: "Failed to create session" });
  }
};

// Delete a session
const deleteTrainerSession = async (req, res) => {
  try {
    const { id } = req.params;
    await TrainerSession.findByIdAndDelete(id);
    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete session" });
  }
};

module.exports = {
  getTrainerSessions,
  createTrainerSession,
  deleteTrainerSession,
};
