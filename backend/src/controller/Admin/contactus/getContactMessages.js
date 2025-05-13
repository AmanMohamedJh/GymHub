const ContactUs = require("../../../models/Contactus/contactUsModel");

/**
 * Get all contact us messages for admin
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Contact messages
 */
const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactUs.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getContactMessages:", error);
    res.status(500).json({ message: "Failed to retrieve contact messages" });
  }
};

module.exports = getContactMessages;
