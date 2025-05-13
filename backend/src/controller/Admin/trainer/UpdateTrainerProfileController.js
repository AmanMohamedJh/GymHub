const TrainerRegistration = require("../../../models/Trainer/TrainerRegistration");
const User = require("../../../models/userModel");

/**
 * Update a trainer's profile (name, email, phone)
 */
const updateTrainerProfileController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    // Validate input
    if (!name && !email && !phone) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field (name, email, or phone) is required for update",
      });
    }

    // Find the trainer registration
    const trainer = await TrainerRegistration.findById(id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    // Update trainer registration fields
    if (name) {
      trainer.name = name;
    }

    if (email) {
      trainer.email = email;
    }

    if (phone) {
      trainer.phone = phone;
    }

    // Save the trainer registration updates
    await trainer.save();

    // Also update the user document if name or email was changed
    if (name || email) {
      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;

      await User.findByIdAndUpdate(trainer.user, updateData);
    }

    return res.status(200).json({
      success: true,
      message: "Trainer profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating trainer profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update trainer profile",
      error: error.message,
    });
  }
};

module.exports = updateTrainerProfileController;
