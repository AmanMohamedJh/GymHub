const Gym = require("../../../models/Gym_Owner/Gym");
const GymReview = require("../../../models/Gym_Owner/GymReview");
const ClientGymRegistration = require("../../../models/Gym_Owner/ClientGymRegistration");
const Equipment = require("../../../models/Gym_Owner/Equipment");
const GymAd = require("../../../models/Gym_Owner/GymAd");
const fs = require("fs");
const path = require("path");

/**
 * Delete a gym and all associated data
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Success message
 */
const deleteGym = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the gym
    const gym = await Gym.findById(id);

    if (!gym) {
      return res.status(404).json({ message: "Gym not found" });
    }

    // Begin transaction to ensure all operations succeed or fail together
    const session = await Gym.startSession();
    session.startTransaction();

    try {
      // 1. Delete all gym reviews
      await GymReview.deleteMany({ gymId: id }, { session });

      // 2. Delete all client gym registrations
      await ClientGymRegistration.deleteMany({ gymId: id }, { session });

      // 3. Update equipment to set them back to inventory
      await Equipment.updateMany(
        { gymId: id },
        { $set: { gymId: null, inInventory: true } },
        { session }
      );

      // 4. Delete any gym ads related to this gym
      // (Assuming there's a relation - if not, this can be removed)
      await GymAd.deleteMany({ gymId: id }, { session });

      // 5. Delete image files
      if (gym.images && gym.images.length > 0) {
        gym.images.forEach((imagePath) => {
          try {
            const fullPath = path.join(__dirname, "../../../../", imagePath);
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
            }
          } catch (err) {
            console.error(`Failed to delete image: ${imagePath}`, err);
          }
        });
      }

      // 6. Delete certificate file
      if (gym.certificate) {
        try {
          const certPath = path.join(
            __dirname,
            "../../../../",
            gym.certificate
          );
          if (fs.existsSync(certPath)) {
            fs.unlinkSync(certPath);
          }
        } catch (err) {
          console.error(
            `Failed to delete certificate: ${gym.certificate}`,
            err
          );
        }
      }

      // 7. Delete the gym itself
      await Gym.findByIdAndDelete(id, { session });

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      return res.status(200).json({
        message: "Gym deleted successfully",
        id,
      });
    } catch (error) {
      // If an error occurred, abort the transaction
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteGym:", error);
    return res.status(500).json({ message: "Failed to delete gym" });
  }
};

module.exports = deleteGym;
