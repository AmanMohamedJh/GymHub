const TrainerRegistration = require("../../../models/Trainer/TrainerRegistration");
const User = require("../../../models/userModel");

/**
 * Update a trainer's status (active/suspended)
 */
const updateTrainerStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate input
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status must be provided",
      });
    }

    // Validate status value
    if (status !== "active" && status !== "suspended") {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'active' or 'suspended'",
      });
    }

    // Find the trainer
    const trainer = await TrainerRegistration.findById(id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    // Update user status
    // In this implementation, we're using isEmailVerified as a proxy for account status
    // In a real implementation, you might have a dedicated 'status' or 'isActive' field
    await User.findByIdAndUpdate(trainer.user, {
      isEmailVerified: status === "active",
    });

    return res.status(200).json({
      success: true,
      message: `Trainer status updated to ${status} successfully`,
      id,
      status,
    });
  } catch (error) {
    console.error("Error updating trainer status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update trainer status",
      error: error.message,
    });
  }
};

module.exports = updateTrainerStatusController;
