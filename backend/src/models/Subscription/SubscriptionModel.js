const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planType: {
      type: String,
      enum: ["Free", "Monthly", "Yearly"],
      required: true,
    },
    price: {
      type: Number,
      enum: [3500, 15000],
      required: true,
      default: 3500,
    },
    status: {
      type: String,
      enum: ["Active", "Expired", "Canceled"],
      default: "Active",
    },
    paymentId: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    stripeCustomerId: {
      type: String,
    },
    stripeSubscriptionId: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
