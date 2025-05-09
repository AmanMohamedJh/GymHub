const TrainerRegistration = require('../../models/Trainer/TrainerRegistration');

// Get all trainers
exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await TrainerRegistration.find({});
    res.json(trainers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register a new trainer (one per user)
exports.registerTrainer = async (req, res) => {
  try {
    const userId = req.user._id;
    const existing = await TrainerRegistration.findOne({ user: userId });
    if (existing) {
      return res.status(400).json({ error: 'Trainer already registered.' });
    }
    const { name, email, phone, gender, trainingType, address, age, yearsOfExperience } = req.body;
    if (yearsOfExperience === undefined || yearsOfExperience === null) {
      return res.status(400).json({ error: 'Years of experience is required.' });
    }
    let certificateUrl = '';
    if (req.file) {
      certificateUrl = `/uploads/Trainer_certificates/${req.file.filename}`;
    }
    const trainer = new TrainerRegistration({
      user: userId,
      name,
      email,
      phone,
      gender,
      trainingType,
      address,
      age,
      yearsOfExperience,
      certificateUrl
    });
    await trainer.save();
    res.status(201).json(trainer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current user's trainer registration
exports.getMyTrainerRegistration = async (req, res) => {
  try {
    const userId = req.user._id;
    const trainer = await TrainerRegistration.findOne({ user: userId });
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer registration not found.' });
    }
    res.json(trainer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Update current user's trainer registration
exports.updateMyTrainerRegistration = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateFields = { ...req.body };

    // Remove fields not allowed to be updated
    delete updateFields.name;
    delete updateFields.email;

    // Handle certificate file upload
    if (req.file) {
      updateFields.certificateUrl = `/uploads/Trainer_certificates/${req.file.filename}`;
    }

    const updated = await TrainerRegistration.findOneAndUpdate(
      { user: userId },
      { $set: updateFields },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Trainer registration not found.' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUBLIC: Get trainer registration details by user id
exports.getTrainerRegistrationByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const trainer = await TrainerRegistration.findOne({ user: userId }).populate('user', 'name email');
    if (!trainer) {
      return res.status(404).json({ error: 'Trainer registration not found.' });
    }
    res.json(trainer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove current user's trainer registration
exports.deleteMyTrainerRegistration = async (req, res) => {
  try {
    const userId = req.user._id;
    const deleted = await TrainerRegistration.findOneAndDelete({ user: userId });
    if (!deleted) {
      return res.status(404).json({ error: 'Trainer registration not found.' });
    }
    res.json({ message: 'Trainer registration deleted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
