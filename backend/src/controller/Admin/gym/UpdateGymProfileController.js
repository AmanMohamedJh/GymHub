const Gym = require("../../../models/Gym_Owner/Gym");

/**
 * Update a gym's profile (name, location)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Updated gym data
 */
const updateGymProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Please provide name to update" });
    }

    // Find the gym by id
    const gym = await Gym.findById(id);

    if (!gym) {
      return res.status(404).json({ message: "Gym not found" });
    }

    // Update the gym data
    if (name) {
      gym.name = name;
    }

    await gym.save();

    // Return the updated gym data
    return res.status(200).json({
      message: "Gym profile updated successfully",
    });
  } catch (error) {
    console.error("Error in updateGymProfile:", error);
    return res.status(500).json({ message: "Failed to update gym profile" });
  }
};

module.exports = updateGymProfile;
