const Subscription = require("../../../models/Subscription/SubscriptionModel");

/**
 * Update subscription price
 */
exports.updateSubscriptionPrice = async (req, res) => {
  try {
    const id = req.params.id;
    const { price } = req.body;

    if (!price) {
      return res.status(400).json({ message: "Price is required" });
    }

    // Convert price to Number if it's a string
    const priceValue = Number(price);

    if (isNaN(priceValue)) {
      return res.status(400).json({ message: "Price must be a valid number" });
    }

    const subscription = await Subscription.findByIdAndUpdate(
      id,
      { price: priceValue },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res.status(200).json({
      message: "Subscription price updated successfully",
      subscription,
    });
  } catch (error) {
    console.error("Error updating subscription price:", error);
    return res.status(500).json({
      message: "Error updating subscription price",
      error: error.message,
    });
  }
};
