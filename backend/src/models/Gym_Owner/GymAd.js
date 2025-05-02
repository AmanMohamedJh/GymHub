const mongoose = require("mongoose");

const gymAdSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["popup"],
      required: true,
    },
    targetLocation: {
      type: String,
      default: "All Locations",
    },
    targetAgeGroup: {
      type: String,
      default: "all",
    },
    targetInterests: [
      {
        type: String,
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "scheduled", "ended"],
      default: "scheduled",
    },
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    gym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gym",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Middleware to automatically set status based on dates
gymAdSchema.pre("save", function (next) {
  const now = new Date();
  
  if (now >= this.startDate && now <= this.endDate) {
    this.status = "active";
  } else if (now < this.startDate) {
    this.status = "scheduled";
  } else if (now > this.endDate) {
    this.status = "ended";
  }
  
  next();
});

module.exports = mongoose.model("GymAd", gymAdSchema);
