const mongoose = require("mongoose");

const TrainerRegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Each user can register only once
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    trainingType: { type: String, required: true },
    address: { type: String, required: true },
    age: { type: Number, required: true },
    yearsOfExperience: { type: Number, required: true },
    certificateUrl: { type: String, required: true },
    // path to uploaded file
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "TrainerRegistrations" }
);

module.exports = mongoose.model(
  "TrainerRegistration",
  TrainerRegistrationSchema
);
