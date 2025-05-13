const TrainerRegistration = require("../../../models/Trainer/TrainerRegistration");
const TrainerSession = require("../../../models/Trainer/TrainerSession");
const ClientTrainerSessions = require("../../../models/Client/ClientTrainerSessions");
const User = require("../../../models/userModel");

/**
 * Get all trainers with additional info (client count, rating)
 */
const getTrainersController = async (req, res) => {
  try {
    // Get all trainer registrations
    const trainers = await TrainerRegistration.find()
      .populate("user", "name email phone")
      .lean();

    // Create an array to hold the final results with additional details
    const trainersWithDetails = [];

    // For each trainer, get the additional details
    for (const trainer of trainers) {
      // Get all sessions by this trainer
      const sessions = await TrainerSession.find({
        trainerRegistration: trainer._id,
      });

      // Get session IDs
      const sessionIds = sessions.map((session) => session._id);

      // Count active clients from ClientTrainerSessions model
      const clientCount = await ClientTrainerSessions.countDocuments({
        sessionBookingId: { $in: sessionIds },
        status: "joined",
      });

      // Get user status (active/suspended/pending)
      const userDetails = await User.findById(trainer.user);

      // Calculate average rating (mock data for now, implement real ratings if available)
      // In a real implementation, you would query a ratings collection
      const rating = parseFloat((3.5 + Math.random() * 1.5).toFixed(1));

      // Get gym affiliation (if any)
      let gym = "Independent";

      // Format experience
      const experience = `${trainer.yearsOfExperience} years`;

      // Add to results array
      trainersWithDetails.push({
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        phone: trainer.phone,
        specialization: trainer.trainingType,
        experience: experience,
        gym: gym,
        status: trainer.status,
        rating: rating,
        clientCount: clientCount,
      });
    }

    return res.status(200).json(trainersWithDetails);
  } catch (error) {
    console.error("Error in getTrainers:", error);
    return res.status(500).json({ message: "Failed to fetch trainers" });
  }
};

module.exports = getTrainersController;
