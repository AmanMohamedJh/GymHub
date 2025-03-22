//import of Model
const User = require("../models/userModel");

//import of Json Web Token (JWT Authorizations)
const jwt = require("jsonwebtoken");
const path = require("path");
const nodemailer = require("nodemailer");

// Configure nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // This should be an App Password
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

// Function to create a JWT token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET_KEY, { expiresIn: "3d" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    // Return user data including isEmailVerified status
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  try {
    const user = await User.signup(name, email, phone, password, role);
    const token = createToken(user._id);

    // Return user data including isEmailVerified status
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: false,
      token,
    });
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

    // Handle profile picture upload
    if (req.file) {
      // Create the URL for the uploaded file
      const profilePicUrl = `/uploads/profiles/${req.file.filename}`;
      user.profilePicture = profilePicUrl;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
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

// Send verification code
const sendVerificationCode = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    // Generate a random 6-digit code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const codeExpiry = new Date(Date.now() + 30 * 60000); // Code expires in 30 minutes

    // Save the code to user
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = codeExpiry;
    await user.save();

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // This should be an App Password
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    });

    // Send email
    const mailOptions = {
      from: `"GYMHUB" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "GYMHUB - Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Email Verification</h2>
          <p style="color: #666;">Hello ${user.name},</p>
          <p style="color: #666;">Here is your verification code:</p>
          <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #007bff; margin: 0; font-size: 24px;">${verificationCode}</h3>
          </div>
          <p style="color: #666;">Enter this code on the verification page to verify your email address.</p>
          <p style="color: #666;">This code will expire in 30 minutes.</p>
        </div>
      `,
    };

    // Verify connection configuration
    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.log("Transporter verification error:", error);
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });

    // Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error("Email error:", error);
    res
      .status(400)
      .json({ error: "Failed to send verification code. Please try again." });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { verificationCode } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: "Email is already verified" });
    }

    if (!user.verificationCode || !user.verificationCodeExpires) {
      return res.status(400).json({
        error: "No verification code found. Please request a new one.",
      });
    }

    if (Date.now() > user.verificationCodeExpires) {
      return res.status(400).json({
        error: "Verification code has expired. Please request a new one.",
      });
    }

    if (verificationCode !== user.verificationCode) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    user.isEmailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: true,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    res
      .status(400)
      .json({ error: "Failed to verify email. Please try again." });
  }
};

// Verify token
const verifyToken = async (req, res) => {
  try {
    // If the middleware passed, the token is valid
    res.status(200).json({ valid: true });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = {
  loginUser,
  signupUser,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  deleteUserAccount,
  sendVerificationCode,
  verifyEmail,
  verifyToken,
};
