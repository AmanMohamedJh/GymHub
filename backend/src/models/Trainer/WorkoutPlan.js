const mongoose = require("mongoose");

const workoutPlanSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true }, // duration in weeks
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkoutPlan", workoutPlanSchema);
