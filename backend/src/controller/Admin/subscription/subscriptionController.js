const Subscription = require("../../../models/Subscription/SubscriptionModel");
const User = require("../../../models/userModel");

/**
 * Get all subscription plans with dynamic descriptions
 */
// Moved to getSubscriptionPlansController.js

/**
 * Get all user subscriptions
 */
// Moved to getAllSubscriptionsController.js

/**
 * Update subscription price
 */
// Moved to updateSubscriptionPriceController.js

/**
 * Get subscription by ID
 */
exports.getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id).populate(
      "userId",
      "name email"
    );

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res.status(200).json(subscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return res
      .status(500)
      .json({ message: "Error fetching subscription", error: error.message });
  }
};

/**
 * Update subscription status
 */
exports.updateSubscriptionStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res
        .status(400)
        .json({ message: "Subscription ID and status are required" });
    }

    if (!["Active", "Expired", "Canceled"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Status must be Active, Expired, or Canceled",
      });
    }

    const subscription = await Subscription.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Update user's hasActiveSubscription field
    await User.findByIdAndUpdate(subscription.userId, {
      hasActiveSubscription: status === "Active",
    });

    return res.status(200).json({
      message: "Subscription status updated successfully",
      subscription,
    });
  } catch (error) {
    console.error("Error updating subscription status:", error);
    return res.status(500).json({
      message: "Error updating subscription status",
      error: error.message,
    });
  }
};
