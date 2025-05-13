const ContactUs = require("../../../models/Contactus/contactUsModel");
const { sendReplyEmail } = require("./emailService");

/**
 * Reply to a contact message
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Updated contact message
 */
const replyToContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({ message: "Reply content is required" });
    }

    const message = await ContactUs.findById(id);
    if (!message) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    // Update message status and reply
    message.status = "replied";
    message.reply = reply;
    await message.save();

    // Send reply email
    await sendReplyEmail(message, reply);

    res.status(200).json({
      message: "Reply sent successfully",
      contactMessage: message,
    });
  } catch (error) {
    console.error("Error in replyToContactMessage:", error);
    res.status(500).json({ message: "Failed to send reply" });
  }
};

module.exports = replyToContactMessage;
