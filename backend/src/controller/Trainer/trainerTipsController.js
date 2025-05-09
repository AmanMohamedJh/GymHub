const TrainerTips = require('../../models/Trainer/TrainerTips');
const TrainerRegistration = require('../../models/Trainer/TrainerRegistration');

// Add a new tip
exports.addTrainerTip = async (req, res) => {
  try {
    const { title, description } = req.body;
    let userName = req.user.name;
    if (!userName) {
      const User = require('../../models/userModel');
      const userDoc = await User.findById(req.user._id).select('name');
      userName = userDoc ? userDoc.name : 'Unknown';
    }
    console.log('Creating tip for userId:', req.user._id, 'userName:', userName);
    const tip = await TrainerTips.create({
      userId: req.user._id,
      userName,
      title,
      description,
      replies: []
    });
    res.status(201).json(tip);
  } catch (err) {
    console.error('AddTrainerTip ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all tips (for all users)
exports.getAllTrainerTips = async (req, res) => {
  try {
    const tips = await TrainerTips.find().sort({ createdAt: -1 });
    res.json(tips);
  } catch (err) {
    console.error('AddTrainerTip ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get tips for the logged-in trainer
exports.getTrainerTipsByTrainer = async (req, res) => {
  try {
    const userId = req.user._id;
    const tips = await TrainerTips.find({ userId }).sort({ createdAt: -1 });
    res.json(tips);
  } catch (err) {
    console.error('AddTrainerTip ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

// Add a reply to a tip
exports.addReplyToTip = async (req, res) => {
  try {
    const { tipId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;
    let userName = req.user.name;
    if (!userName) {
      const User = require('../../models/userModel');
      const userDoc = await User.findById(userId).select('name');
      userName = userDoc ? userDoc.name : 'Unknown';
    }
    const tip = await TrainerTips.findById(tipId);
    if (!tip) return res.status(404).json({ error: 'Tip not found' });
    tip.replies.unshift({ userId, userName, comment });
    await tip.save();
    res.json(tip);
  } catch (err) {
    console.error('AddTrainerTip ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a tip (by trainer)
exports.deleteTrainerTip = async (req, res) => {
  try {
    const userId = req.user._id;
    const { tipId } = req.params;
    const tip = await TrainerTips.findOneAndDelete({ _id: tipId, userId });
    if (!tip) return res.status(404).json({ error: 'Tip not found or unauthorized' });
    res.json({ message: 'Tip deleted' });
  } catch (err) {
    console.error('AddTrainerTip ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};

// Edit a tip (by trainer)
exports.editTrainerTip = async (req, res) => {
  try {
    const userId = req.user._id;
    const { tipId } = req.params;
    const { title, description } = req.body;
    const tip = await TrainerTips.findOneAndUpdate(
      { _id: tipId, userId },
      { $set: { title, description } },
      { new: true }
    );
    if (!tip) return res.status(404).json({ error: 'Tip not found or unauthorized' });
    res.json(tip);
  } catch (err) {
    console.error('AddTrainerTip ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};
