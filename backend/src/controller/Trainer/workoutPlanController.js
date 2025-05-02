const WorkoutPlan = require('../../models/Trainer/WorkoutPlan');

// Create a new workout plan
const createWorkoutPlan = async (req, res) => {
  const { title, description, duration, difficulty, trainerId } = req.body;

  try {
    const newPlan = new WorkoutPlan({
      title,
      description,
      duration,
      difficulty,
      trainerId,
    });

    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create workout plan' });
  }
};

// Get all workout plans by trainer
const getWorkoutPlans = async (req, res) => {
  const { trainerId } = req.params;

  try {
    const plans = await WorkoutPlan.find({ trainerId });
    res.status(200).json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workout plans' });
  }
};

// Delete a workout plan
const deleteWorkoutPlan = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPlan = await WorkoutPlan.findByIdAndDelete(id);
    if (!deletedPlan) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }
    res.status(200).json({ message: 'Workout plan deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete workout plan' });
  }
};

module.exports = {
  createWorkoutPlan,
  getWorkoutPlans,
  deleteWorkoutPlan,
};
