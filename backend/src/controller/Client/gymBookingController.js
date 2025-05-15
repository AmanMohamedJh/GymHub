const mongoose = require("mongoose");
const GymBookingDetails = require("../../models/Client/gymBookingDetails");
const User = require("../../models/userModel");
const Gym = require("../../models/Gym_Owner/Gym");
const gymBookingDetails = require("../../models/Client/gymBookingDetails");
const cron = require("node-cron");


exports.makeBookingGym = async (req, res) => {
  const { gymId } = req.params;
  const { clientId, fullName, email, phone, date, time, amenities } = req.body;

  // Basic validation
  if (!clientId || !fullName || !email || !phone || !date || !time) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Combine date and time into a single Date object
    const bookingTime = new Date(`${date}T${time}`);

    // Create a new booking document
    const newBooking = new GymBookingDetails({
      clientId,
      gymId,
      email,
      contactNumber: phone,
      bookingTime,
      selectedAmenities: amenities,
    });

    // Save the booking to the database
    await newBooking.save();

    await updatePastBookingsStatus();

    res
      .status(201)
      .json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

exports.getBookingCount = async (req, res) => {
  const { profileId } = req.params;

  try {
    // Total bookings for the specified client profile
    const totalBookings = await GymBookingDetails.countDocuments({
      clientId: profileId,
    });

    // Upcoming bookings: status not 'cancelled' and bookingTime in the future
    const upcomingBookings = await GymBookingDetails.countDocuments({
      clientId: profileId,
      status: { $ne: "Cancelled" },
      bookingTime: { $gte: new Date() },
    });
    res.json({ totalBookings, upcomingBookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Download a simple CSV report with 3 fields: BookingID, GymName, Status
exports.downloadSimpleReportCSV = async (req, res) => {
  const { profileId } = req.params;
  try {
    const bookings = await GymBookingDetails.find({ clientId: profileId });
    if (!bookings.length) {
      return res.status(404).json({ error: "No bookings found for this client." });
    }
    // Fetch gym name for each booking
    const rows = await Promise.all(
      bookings.map(async (booking) => {
        const gym = await Gym.findById(booking.gymId);
        return {
          BookingID: booking._id,
          GymName: gym?.name || "Gym name not found",
          Status: booking.status || '',
        };
      })
    );
    // Convert to CSV
    const fields = ["BookingID", "GymName", "Status"];
    const csvRows = [fields.join(",")];
    rows.forEach(row => {
      csvRows.push(fields.map(field => row[field]).join(","));
    });
    const csv = csvRows.join('\r\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="simple_gymhub_report.csv"');
    res.status(200).send(csv);
  } catch (err) {
    res.status(500).json({ error: "An error occurred while generating the CSV report." });
  }
};

exports.getAllBookings = async (req, res) => {
  const { profileId } = req.params;

  try {
    // Fetch bookings for the client
    const bookings = await GymBookingDetails.find({ clientId: profileId });

    if (!bookings.length) {
      return res
        .status(404)
        .json({ error: "No bookings found for this client." });
    }

    // Manually fetch gym details for each booking
    const bookingsWithGymDetails = await Promise.all(
      bookings.map(async (booking) => {
        const gym = await Gym.findById(booking.gymId);
        return {
          ...booking.toObject(),
          gymName: gym?.name || "Gym name not found",
          gymLocation: gym?.location || "Location not available",
        };
      })
    );

    res.status(200).json(bookingsWithGymDetails);
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching bookings." });
  }
};

exports.cancelBooking = async (req, res) => {
  const bookingId = req.params.id;

  try {
    // Find the booking by ID
    const booking = await GymBookingDetails.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Check if the booking is already cancelled
    if (booking.status === "Cancelled") {
      return res.status(400).json({ error: "Booking is already cancelled" });
    }

    // Check if the booking time is in the future
    const currentTime = new Date();
    if (new Date(booking.bookingTime) <= currentTime) {
      return res.status(400).json({ error: "Cannot cancel past bookings" });
    }

    // Update status to 'Cancelled'
    booking.status = "Cancelled";
    await booking.save();

    res
      .status(200)
      .json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res
      .status(500)
      .json({ error: "An error occurred while cancelling the booking" });
  }
};

exports.deleteBooking = async (req, res) => {
  const bookingId = req.params.id;

  // Validate the bookingId format
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).json({ error: "Invalid booking ID" });
  }

  try {
    // Find the booking by ID
    const booking = await GymBookingDetails.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Delete the booking
    await GymBookingDetails.deleteOne({ _id: bookingId });

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the booking" });
  }
};

// Function to update the status of past bookings (cron job)
const updatePastBookingsStatus = async () => {
  try {
    const currentDate = new Date();

    // Find all bookings where the bookingTime has passed and the status is not 'Cancelled'
    const bookingsToUpdate = await GymBookingDetails.find({
      bookingTime: { $lt: currentDate }, // Booking time is in the past
      status: { $ne: "Cancelled" }, // Exclude canceled bookings
    });

    // Loop through the bookings and update the status to 'Completed'
    bookingsToUpdate.forEach(async (booking) => {
      booking.status = "Completed"; // Change to 'Completed' or any other status you prefer
      await booking.save(); // Save the updated booking
    });
  } catch (error) {
    console.error("Error updating past bookings status:", error);
  }
};

// Schedule the cron job to run every minute for immediate effect
cron.schedule("* * * * *", updatePastBookingsStatus); // Runs every minute
