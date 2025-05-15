const TrainerRegistration = require("../../../models/Trainer/TrainerRegistration");
const TrainerSession = require("../../../models/Trainer/TrainerSession");
const ClientTrainerSessions = require("../../../models/Client/ClientTrainerSessions");
const fs = require("fs");
const path = require("path");

/**
 * Delete a trainer and all associated data
 */
const deleteTrainerController = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the trainer
    const trainer = await TrainerRegistration.findById(id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: "Trainer not found",
      });
    }

    // Begin transaction for data consistency
    const session = await TrainerRegistration.startSession();
    session.startTransaction();

    try {
      // 1. Get all sessions by this trainer
      const sessions = await TrainerSession.find({
        trainerRegistration: trainer._id,
      });

      // Get session IDs
      const sessionIds = sessions.map((session) => session._id);

      // 2. Delete client-trainer sessions for these sessions
      await ClientTrainerSessions.deleteMany(
        {
          sessionBookingId: { $in: sessionIds },
        },
        { session }
      );

      // 3. Delete trainer sessions
      await TrainerSession.deleteMany(
        {
          trainerRegistration: trainer._id,
        },
        { session }
      );

      // 5. Delete trainer registration
      await TrainerRegistration.findByIdAndDelete(id, { session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        success: true,
        message: "Trainer deleted successfully",
        id,
      });
    } catch (error) {
      // If an error occurred, abort the transaction
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Error deleting trainer:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete trainer",
      error: error.message,
    });
  }
};

module.exports = deleteTrainerController;
