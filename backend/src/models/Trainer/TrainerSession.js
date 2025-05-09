const mongoose = require('mongoose');

const TrainerSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainerRegistration: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainerRegistration',
    required: true
  },
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true }, // from TrainerRegistration.trainingType
  status: {
    type: String,
    enum: ['active', 'paused', 'cancelled'],
    default: 'active',
    required: true
  },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'TrainerSessions' });

module.exports = mongoose.model('TrainerSession', TrainerSessionSchema);
