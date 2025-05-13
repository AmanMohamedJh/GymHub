const Subscription = require("../../../models/Subscription/SubscriptionModel");

/**
 * Get all subscription plans with dynamic descriptions
 */
exports.getSubscriptionPlans = async (req, res) => {
  try {
    // Define plans based on the model's plan types
    const plans = [
      {
        id: 1,
        type: "Monthly",
        amount: 29.99, // $29.99 (matches the 2999 cents in the subscription controller)
        description:
          "Access to all premium features, trainer support, and workout plans for 30 days.",
      },
      {
        id: 2,
        type: "Yearly",
        amount: 299.99, // $299.99 (matches the 29999 cents in the subscription controller)
        description:
          "Full access to all premium features with dedicated support, personalized workout plans, and exclusive content for 12 months at a discounted rate.",
      },
    ];

    // You could potentially pull pricing from the database for more dynamic behavior
    // For example, finding the most common price for each plan type:
    /*
    const monthlySubscriptions = await Subscription.find({ planType: "Monthly" });
    const yearlySubscriptions = await Subscription.find({ planType: "Yearly" });
    
    if (monthlySubscriptions.length > 0) {
      // Get the most common price or the latest one
      const latestMonthly = monthlySubscriptions.sort((a, b) => b.createdAt - a.createdAt)[0];
      plans[0].amount = (latestMonthly.price / 100).toFixed(2);
    }
    
    if (yearlySubscriptions.length > 0) {
      const latestYearly = yearlySubscriptions.sort((a, b) => b.createdAt - a.createdAt)[0];
      plans[1].amount = (latestYearly.price / 100).toFixed(2);
    }
    */

    return res.status(200).json(plans);
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    return res.status(500).json({
      message: "Error fetching subscription plans",
      error: error.message,
    });
  }
};
