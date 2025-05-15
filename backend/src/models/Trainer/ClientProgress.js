const mongoose = require("mongoose");

const clientProgressSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "Trainer", required: true },
  date: { type: Date, default: Date.now },
  metrics: { type: Object }, // flexible for different progress metrics
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("ClientProgress", clientProgressSchema);
