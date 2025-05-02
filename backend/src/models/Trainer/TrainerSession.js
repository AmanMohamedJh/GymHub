const mongoose = require("mongoose");

const trainerSessionSchema = new mongoose.Schema({
  trainerName: { type: String, required: true },
  day: { type: String, required: true },
  time: { type: String, required: true },
  payment: { type: Number, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

const TrainerSession = mongoose.model("TrainerSession", trainerSessionSchema);
module.exports = TrainerSession;
