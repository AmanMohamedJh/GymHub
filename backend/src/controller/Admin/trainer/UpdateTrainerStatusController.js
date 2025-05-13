const TrainerRegistration = require("../../../models/Trainer/TrainerRegistration");

/**
 * Update a trainer's status (pending/approved/rejected)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Updated trainer status
 */
const updateTrainerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate input
    if (!status) {
      return res
        .status(400)
        .json({ message: "Please provide a status to update" });
    }

    // Validate status value
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be either 'pending', 'approved', or 'rejected'",
      });
    }

    // Find the trainer registration by id
    const trainer = await TrainerRegistration.findById(id);

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    // Update the trainer status
    trainer.status = status;

    await trainer.save();

    // Return the updated trainer status
    return res.status(200).json({
      message: "Trainer status updated successfully",
    });
  } catch (error) {
    console.error("Error in updateTrainerStatus:", error);
    return res.status(500).json({ message: "Failed to update trainer status" });
  }
};

module.exports = updateTrainerStatus;
