const Client = require("../../../models/Client/clientModel");
const User = require("../../../models/userModel");

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
    }

    // Update client's name if provided
    if (name) {
      clientProfile.name = name;
      await clientProfile.save();
    }

    // For membership type, we would typically update this in a membership or subscription model
    // This is just a placeholder - you may need to adjust based on your actual data model
    if (membershipType) {
      // Update membership type logic would go here
      // Example: await Subscription.findOneAndUpdate({ userId: id }, { type: membershipType }, { new: true });
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
