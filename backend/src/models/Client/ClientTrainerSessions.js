const mongoose = require('mongoose');

const clientTrainerSessionSchema = new mongoose.Schema({
  sessionBookingId: { type: mongoose.Schema.Types.ObjectId, required: true }, // reference to the session
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  emergencyContact: { type: String },
  preferredCommunication: { type: String },
  fitnessGoals: { type: String },

  status: { type: String, enum: ['joined', 'cancelled'], default: 'joined' },
  joinedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // Add more fields here if needed for future extensibility
});

module.exports = mongoose.model('ClientTrainerSessions', clientTrainerSessionSchema);
