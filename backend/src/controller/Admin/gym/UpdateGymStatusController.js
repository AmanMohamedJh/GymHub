const Gym = require("../../../models/Gym_Owner/Gym");

/**
 * Update a gym's status (active/inactive)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Updated gym status
 */
const updateGymStatus = async (req, res) => {
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
    if (status !== "active" && status !== "inactive") {
      return res
        .status(400)
        .json({ message: "Status must be either 'active' or 'inactive'" });
    }

    // Find the gym by id
    const gym = await Gym.findById(id);

    if (!gym) {
      return res.status(404).json({ message: "Gym not found" });
    }

    // Update the gym status
    gym.status = status;

    // Save the updated gym
    const updatedGym = await gym.save();

    // Return the updated gym status
    return res.status(200).json({
      message: "Gym status updated successfully",
    });
  } catch (error) {
    console.error("Error in updateGymStatus:", error);
    return res.status(500).json({ message: "Failed to update gym status" });
  }
};

module.exports = updateGymStatus;
