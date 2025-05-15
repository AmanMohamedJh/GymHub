const ClientProgress = require("../../models/Trainer/ClientProgress");

// Get all progress records for a trainer or client
const getProgress = async (req, res) => {
  try {
    const { trainerId, clientId } = req.query;
    let filter = {};
    if (trainerId) filter.trainerId = trainerId;
    if (clientId) filter.clientId = clientId;
    const progress = await ClientProgress.find(filter);
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch progress" });
  }
};

// Add new progress record
const addProgress = async (req, res) => {
  try {
    const { clientId, trainerId, metrics, notes } = req.body;
    const progress = new ClientProgress({ clientId, trainerId, metrics, notes });
    await progress.save();
    res.status(201).json(progress);
  } catch (err) {
    res.status(400).json({ error: "Failed to add progress" });
  }
};

// Update progress
const updateProgress = async (req, res) => {
  try {
    const progress = await ClientProgress.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!progress) return res.status(404).json({ error: "Progress not found" });
    res.json(progress);
  } catch (err) {
    res.status(400).json({ error: "Failed to update progress" });
  }
};

// Delete progress
const deleteProgress = async (req, res) => {
  try {
    await ClientProgress.findByIdAndDelete(req.params.id);
    res.json({ message: "Progress deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete progress" });
  }
};

module.exports = { getProgress, addProgress, updateProgress, deleteProgress };
