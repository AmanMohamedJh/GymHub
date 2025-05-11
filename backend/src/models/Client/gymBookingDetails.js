const mongoose = require("mongoose");

const gymBookingSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },
    gymId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Gym",
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    bookingTime: {
        type: Date,
        required: true
    },
    selectedAmenities: [
        { type: String }
    ],
    status: {
        type: String,
        enum: ['Pending', 'Cancelled', 'Completed'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

module.exports = mongoose.model("GymBooking", gymBookingSchema);
