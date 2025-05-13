const Client = require("../../../models/Client/clientModel");
const User = require("../../../models/userModel");
const Subscription = require("../../../models/Subscription/SubscriptionModel");

/**
 * Controller to update a client's profile information
 * Updates basic client information like name, email, and membership type
 */
const updateClientProfileController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, membershipType } = req.body;

    // Validate required fields
    if (!name && !email && !membershipType) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field (name, email, or membershipType) is required for update",
      });
    }

    // First, update the user document if email or name needs to be updated
    if (name || email) {
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "Client user not found",
        });
      }
    }

    // Update client profile document if needed
    // Find the client profile associated with the user ID
    const clientProfile = await Client.findOne({ userId: id });

    if (!clientProfile) {
      return res.status(404).json({
        success: false,
        message: "Client profile not found",
      });
    } // Update client's name if provided
    if (name) {
      clientProfile.name = name;
      await clientProfile.save();
    }

    // Update membership type in the Subscription model
    if (membershipType) {
      // Check if the provided membership type is valid
      if (!["Free", "Monthly", "Yearly"].includes(membershipType)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid membership type. Must be 'Free', 'Monthly', or 'Yearly'",
        });
      }

      // Find user's current subscription
      const currentSubscription = await Subscription.findOne({
        userId: id,
        status: "Active",
      });

      if (currentSubscription) {
        // Update existing subscription
        currentSubscription.planType = membershipType;

        // If changing to a different plan type, update the end date accordingly
        if (currentSubscription.planType !== membershipType) {
          const endDate = new Date();
          if (membershipType === "Monthly") {
            endDate.setMonth(endDate.getMonth() + 1);
          } else if (membershipType === "Yearly") {
            endDate.setMonth(endDate.getMonth() + 12);
          }
          currentSubscription.endDate = endDate;
        }

        await currentSubscription.save();
      } else {
        // Create a new subscription if none exists
        const endDate = new Date();
        if (membershipType === "Monthly") {
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (membershipType === "Yearly") {
          endDate.setMonth(endDate.getMonth() + 12);
        } else {
          // Free plan for 1 month by default          endDate.setMonth(endDate.getMonth() + 1);
        }

        await Subscription.create({
          userId: id,
          planType: membershipType,
          status: "Active",
          paymentId: `admin_update_${Date.now()}`,
          startDate: new Date(),
          endDate: endDate,
        });
      }

      // Update user's subscription status
      await User.findByIdAndUpdate(id, {
        hasActiveSubscription: membershipType !== "Free",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating client profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update client profile",
      error: error.message,
    });
  }
};

module.exports = updateClientProfileController;
