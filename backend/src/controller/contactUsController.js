
const ContactUs = require("../models/contactUsModel");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const contactUsAdd = async (req, res) => {

    const { userId, name, email, subject, message } = req.body;

    console.log(userId + name + email + subject + message);



    try {
        const contactUs = await ContactUs.create({ userId, name, email, subject, message });

        console.log("succesful");

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ADD,
                pass: process.env.EMAIL_PAS,
            },
        });

        const mailOptions = {
            from: email,
            to: process.env.EMAIL_ADD,
            subject: `Contact form submission:${subject}`,
            text: `Name: ${name} \n Email: ${email} \n Message:${message}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json(contactUs);
    } catch {
        res.status(400).json({ message: "Error adding Contact Us" });
    }

};

//single Q&A detail
const getSingleDetail = async (req, res) => {

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "Invalid id" });
    }
    const detail = await ContactUs.findById(id);
    if (!detail) {
        return res.status(404).json({ message: "no such a detail awailable" });

    }
    res.status(200).json(detail);
};

//All details

const getAllDetails = async (req, res) => {

    try {
        const allDetails = await ContactUs.find().sort({ createdAt: -1 });
        res.status(200).json(allDetails);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

//delete
const deleteDetail = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "Invalid id" });
    }
    const detail = await ContactUs.findOneAndDelete({ _id: id });
    if (!detail) {
        return res.status(404).json({ message: "no such a detail awailable" });

    }
    res.status(200).json(detail);

};


//update
const UpdateDetail = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: "Invalid id" });
    }
    try {
        const detail = await ContactUs.findOneAndUpdate(
            { _id: id },
            {
                ...req.body,

            }
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
    UpdateDetail
};