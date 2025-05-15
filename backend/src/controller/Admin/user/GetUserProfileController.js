const User = require("../../../models/userModel");

/**
 * Controller to get a user's profile by ID
 * Fetches basic user information like name, email, phone
 */
const getUserProfileController = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID, excluding the password field
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get user profile",
      error: error.message,
    });
  }
};

module.exports = getUserProfileController;
