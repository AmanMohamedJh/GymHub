const mongoose = require("mongoose");

const GymReviewSchema = new mongoose.Schema({
  gymId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gym",
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  emoji: {
    type: String,
    default: "",
  },
  response: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  categoryRatings: {
    facilities: { type: Number, default: 0 },
    cleanliness: { type: Number, default: 0 },
    comfort: { type: Number, default: 0 },
    freeWifi: { type: Number, default: 0 },
    valueForMoney: { type: Number, default: 0 },
    location: { type: Number, default: 0 },
  },
});

module.exports = mongoose.model("GymReview", GymReviewSchema);
