const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contactUsSchema = new Schema({

    userId: {
        type: String,

    },

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String
    },
    message: {
        type: String,
        required: true
    },
});




module.exports = mongoose.model("contactUs", contactUsSchema);