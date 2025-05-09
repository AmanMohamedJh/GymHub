const TrainerSession = require('../../models/Trainer/TrainerSession');
const TrainerRegistration = require('../../models/Trainer/TrainerRegistration');

// Update a training session (only for owner)
exports.updateSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const sessionId = req.params.id;
    const { title, date, time, location, status } = req.body;
    const session = await TrainerSession.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found.' });
    if (String(session.user) !== String(userId)) return res.status(403).json({ error: 'Unauthorized.' });
    if (title !== undefined) session.title = title;
    if (date !== undefined) session.date = date;
    if (time !== undefined) session.time = time;
    if (location !== undefined) session.location = location;
    if (status !== undefined) session.status = status;
    await session.save();
    res.json({ message: 'Session updated successfully', session });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Delete a training session (only for owner)
exports.deleteSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const sessionId = req.params.id;
    const session = await TrainerSession.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found.' });
    if (String(session.user) !== String(userId)) return res.status(403).json({ error: 'Unauthorized.' });
    await session.deleteOne();
    res.json({ message: 'Session deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Add a new training session (only for registered trainers)
exports.addSession = async (req, res) => {
  try {
    const userId = req.user._id;
    // Find the trainer registration for this user
    const trainerReg = await TrainerRegistration.findOne({ user: userId });
    if (!trainerReg) {
      return res.status(403).json({ error: 'You must be a registered trainer to add sessions.' });
    }
    const { title, date, time, location, description } = req.body;
    if (!title || !date || !time || !location || !description) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const session = new TrainerSession({
      user: userId,
      trainerRegistration: trainerReg._id,
      title,
      date,
      time,
      location,
      description,
      type: trainerReg.trainingType // prefilled from trainer registration
    });
    await session.save();
    res.status(201).json({ message: 'Session added successfully', session });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Get all sessions for the logged-in trainer
exports.getMySessions = async (req, res) => {
  try {
    const userId = req.user._id;
    const sessions = await TrainerSession.find({ user: userId }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Get all active sessions for a specific trainer registration
exports.getActiveSessionsByTrainer = async (req, res) => {
  try {
    const { trainerId } = req.params;
    const sessions = await TrainerSession.find({
      trainerRegistration: trainerId,
      status: 'active'
    }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// PUBLIC: Get all sessions for a trainer by user id
exports.getSessionsByTrainerUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    // Find the trainer registration for this user
    const trainerReg = await TrainerRegistration.findOne({ user: userId });
    if (!trainerReg) {
      return res.status(404).json({ error: 'Trainer registration not found.' });
    }
    const sessions = await TrainerSession.find({ trainerRegistration: trainerReg._id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
