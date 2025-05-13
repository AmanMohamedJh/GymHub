const ContactUs = require("../../../models/Contactus/contactUsModel");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

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

/**
 * Delete a contact message
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Deleted contact message
 */
const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactUs.findById(id);
    if (!message) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    await ContactUs.findByIdAndDelete(id);

    res.status(200).json({ message: "Contact message deleted successfully" });
  } catch (error) {
    console.error("Error in deleteContactMessage:", error);
    res.status(500).json({ message: "Failed to delete contact message" });
  }
};

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

    // Get access token
    const accessToken = await oauth2Client.getAccessToken();

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    // Send reply email
    const mailOptions = {
      from: `"GYMHUB Support" <${process.env.EMAIL_USER}>`,
      to: message.email,
      subject: `Re: ${message.subject || "Your Contact Request"}`,
      text: `
Dear ${message.name},

Thank you for contacting us. Here is our response to your inquiry:

${reply}

Original Message:
${message.message}

Best regards,
GYMHUB Support Team
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1a1a1a;">Hello ${message.name},</h2>
  
  <p>Thank you for contacting us. Here is our response to your inquiry:</p>
  
  <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
    <p>${reply.replace(/\n/g, "<br>")}</p>
  </div>
  
  <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eaeaea;">
    <h3>Your Original Message:</h3>
    <p style="color: #555;">${message.message.replace(/\n/g, "<br>")}</p>
  </div>
  
  <div style="margin-top: 30px; color: #666; font-size: 14px;">
    <p>Best regards,<br>GYMHUB Support Team</p>
  </div>
</div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Reply sent successfully",
      contactMessage: message,
    });
  } catch (error) {
    console.error("Error in replyToContactMessage:", error);
    res.status(500).json({ message: "Failed to send reply" });
  }
};

module.exports = {
  getContactMessages,
  deleteContactMessage,
  replyToContactMessage,
};
