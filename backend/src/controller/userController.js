//import of Model
const User = require("../models/userModel");

//import of Json Web Token (JWT Authorizations)
const jwt = require("jsonwebtoken");

// Function to create a JWT token

const createToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET_KEY, {
    expiresIn: "3d",
  });
};

//login user

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // Create token including role
    const token = createToken(user._id, user.role);

    res.status(200).json({ email, name: user.name, role: user.role, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//signup user

const signupUser = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  try {
    const user = await User.signup(name, email, phone, password, role);

    //create Token using JWT

    const token = createToken(user._id, user.role);

    res.status(200).json({ name, email, role, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update password
const updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }

    // Validate password strength
    const validator = require("validator");
    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({
        error:
          "Password must contain at least 8 characters, including uppercase, lowercase, number and special character",
      });
    }

    // Get user and verify they exist
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    try {
      // Generate new salt and hash
      const bcrypt = require("bcrypt");
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);

      // Update user's password directly in the database
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { password: hash } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(400).json({ error: "Failed to update password" });
      }

      res.status(200).json({ message: "Password updated successfully" });
    } catch (hashError) {
      console.error("Password hashing error:", hashError);
      return res.status(500).json({ error: "Error updating password" });
    }
  } catch (error) {
    console.error("Password update error:", error);
    res.status(400).json({ error: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    const updatedUser = await user.save();
    res.status(200).json({
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete user account
const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  signupUser,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  deleteUserAccount,
};
