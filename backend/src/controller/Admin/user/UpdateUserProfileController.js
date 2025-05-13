const User = require("../../../models/userModel");
const bcrypt = require("bcrypt");
const validator = require("validator");

/**
 * Controller to update a user's profile information
 * Updates basic user information like name, email, phone, and optionally password
 */
const updateUserProfileController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password } = req.body;

    // Validate required fields
    if (!name && !email && !phone && !password) {
      return res.status(400).json({
        success: false,
        message: "At least one field is required for update",
      });
    }

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user fields if provided
    if (name) {
      user.name = name;
    }

    if (email) {
      // Check if email already exists (other than the current user)
      const emailExists = await User.findOne({ email, _id: { $ne: id } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another account",
        });
      }

      if (!validator.isEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      user.email = email;
    }

    if (phone) {
      user.phone = phone;
    }

    // Handle password update if provided
    if (password) {
      if (!validator.isStrongPassword(password)) {
        return res.status(400).json({
          success: false,
          message:
            "Password is not strong enough. It should contain at least 8 characters, including uppercase, lowercase, number and special character",
        });
      }

      // Generate salt and hash for new password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      user.password = hash;
    }

    // Save the updated user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user profile",
      error: error.message,
    });
  }
};

module.exports = updateUserProfileController;
