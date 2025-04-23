const mongoose = require("mongoose");

const EmergencyContactSchema = new mongoose.Schema(
  {
    name: { type: String },
    phone: { type: String },
    relation: { type: String },
  },
  { _id: false }
);

const ClientGymRegistrationSchema = new mongoose.Schema({
  gymId: { type: mongoose.Schema.Types.ObjectId, ref: "Gym", required: true },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  dob: { type: Date },
  age: { type: Number },
  gender: { type: String },
  fitnessGoals: { type: String },
  medical: { type: String },
  fitnessLevel: { type: String },
  startDate: { type: Date },
  promoCode: { type: String },
  emergencyContact: EmergencyContactSchema,
  status: {
    type: String,
    enum: ["active", "paused", "inactive", "completed", "suspended"],
    default: "active",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "ClientGymRegistration",
  ClientGymRegistrationSchema
);
