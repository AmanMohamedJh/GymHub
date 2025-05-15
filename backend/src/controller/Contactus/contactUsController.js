const ContactUs = require("../../models/Contactus/contactUsModel");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const { google } = require('googleapis');

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

const contactUsAdd = async (req, res) => {
  try {
    const { userId, name, email, subject, message } = req.body;
    console.log("Received data:", req.body);

    // Save to database
    const contactUs = await ContactUs.create({
      userId,
      name,
      email,
      subject,
      message,
    });

    // Get access token
    const accessToken = await oauth2Client.getAccessToken();

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token
      }
    });

    // Email options
    const mailOptions = {
      from: `"GYMHUB Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `Contact Form: ${subject}`,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}
Message: ${message}
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    res.status(200).json({ 
      success: true,
      message: "Contact form submitted successfully",
      data: contactUs 
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

const getAllDetails = async (req, res) => {
  try {
    const allDetails = await ContactUs.find().sort({ createdAt: -1 });
    res.status(200).json(allDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSingleDetail = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Invalid id" });
  }
  const detail = await ContactUs.findById(id);
  if (!detail) {
    return res.status(404).json({ message: "no such a detail available" });
  }
  res.status(200).json(detail);
};

const deleteDetail = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Invalid id" });
  }
  const detail = await ContactUs.findOneAndDelete({ _id: id });
  if (!detail) {
    return res.status(404).json({ message: "no such a detail available" });
  }
  res.status(200).json(detail);
};

const UpdateDetail = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Invalid id" });
  }
  try {
    const detail = await ContactUs.findOneAndUpdate(
      { _id: id },
      { ...req.body }
    );
    if (!detail) {
      return res.status(404).json({ message: "detail not updated" });
    }
    res.status(200).json(detail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  contactUsAdd,
  getSingleDetail,
  getAllDetails,
  deleteDetail,
  UpdateDetail,
};
