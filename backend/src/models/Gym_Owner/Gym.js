const mongoose = require("mongoose");

const gymSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      street: String,
      city: String,
      district: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    images: [
      {
        type: String,
      },
    ],
    operatingHours: {
      weekdays: String,
      weekends: String,
    },
    amenities: [
      {
        type: String,
      },
    ],
    equipment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Equipment",
      },
    ],
    certificate: {
      type: String,
      required: true,
    },
    genderAccess: {
      type: String,
      enum: ["Male", "Female", "Both"],
      default: "Both",
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for faster queries
gymSchema.index({ status: 1 });
gymSchema.index({ ownerId: 1 });
gymSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model("Gym", gymSchema);
