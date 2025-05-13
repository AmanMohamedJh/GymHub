const Subscription = require("../../../models/Subscription/SubscriptionModel");

/**
 * Get all user subscriptions
 */
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate(
      "userId",
      "name email"
    );

    // Format subscriptions according to required structure
    const formattedSubscriptions = subscriptions.map((subscription, index) => {
      // Generate custom description based on planType and price
      let description = "";

      if (subscription.planType === "Monthly") {
        description = `Access to all premium features, trainer support, and workout plans for 30 days at $${(
          subscription.price / 100
        ).toFixed(2)}.`;
      } else if (subscription.planType === "Yearly") {
        description = `Full access to all premium features with dedicated support, personalized workout plans, and exclusive content for 12 months at a discounted rate of $${(
          subscription.price / 100
        ).toFixed(2)}.`;
      } else if (subscription.planType === "Free") {
        description =
          "Basic access to gym facilities and limited features for free users.";
      }

      return {
        id: subscription._id,
        type: subscription.planType,
        amount: (subscription.price / 100).toFixed(2), // Converting cents to dollars with 2 decimal places
        description: description,
        // Include other relevant fields
        status: subscription.status,
        userId: subscription.userId,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
      };
    });

    return res.status(200).json(formattedSubscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return res
      .status(500)
      .json({ message: "Error fetching subscriptions", error: error.message });
  }
};
