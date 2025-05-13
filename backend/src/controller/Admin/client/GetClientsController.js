const User = require("../../../models/userModel");
const Client = require("../../../models/Client/clientModel");
const ClientGymRegistration = require("../../../models/Gym_Owner/ClientGymRegistration");
const Gym = require("../../../models/Gym_Owner/Gym");
const Subscription = require("../../../models/Subscription/SubscriptionModel");
const ClientTrainerSessions = require("../../../models/Client/ClientTrainerSessions");
const GymBooking = require("../../../models/Client/gymBookingDetails");

// Controller to get all clients for admin view
const getClientsController = async (req, res) => {
  try {
    // Find all users with role "client"
    const clientUsers = await User.find({ role: "client" }).select(
      "_id name email"
    );

    // Array to hold the final client data
    const clientsData = [];

    // Process each client user to gather complete information
    for (const user of clientUsers) {
      // Get client profile
      const clientProfile = await Client.findOne({ userId: user._id });

      if (!clientProfile) continue; // Skip if no profile found

      // Get client's gym registration
      const gymRegistration = await ClientGymRegistration.findOne({
        clientId: user._id,
        status: { $in: ["active", "paused", "inactive"] }, // Consider non-completed registrations
      });

      // Get gym details if registration exists
      let gymName = "Not registered";
      if (gymRegistration && gymRegistration.gymId) {
        const gym = await Gym.findById(gymRegistration.gymId);
        if (gym) {
          gymName = gym.name;
        }
      }

      // Get subscription details
      const subscription = await Subscription.findOne({ userId: user._id });

      // Calculate attendance percentage (arbitrary calculation for demo)
      const checkIns = clientProfile.gymActivity?.checkIns || 0;
      // Assuming 100 is the max possible check-ins for 100% attendance
      const attendancePercentage = Math.min(
        Math.round((checkIns / 100) * 100),
        100
      ); // Format date to YYYY-MM-DD format
      const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toISOString().split("T")[0];
      };

      // Find the latest training session
      const latestSession = await ClientTrainerSessions.findOne({
        clientId: user._id,
      }).sort({ updatedAt: -1 });

      // Find the latest gym booking
      const latestGymBooking = await GymBooking.findOne({
        clientId: clientProfile._id,
      }).sort({ createdAt: -1 });

      // Determine last active date from the most recent activity
      let lastActive = clientProfile.bio?.joinedIn; // Default to join date

      // If there's a subscription, use its updatedAt timestamp
      if (subscription && subscription.updatedAt) {
        lastActive = subscription.updatedAt;
      }

      // Check if latest session is more recent
      if (latestSession && latestSession.updatedAt > lastActive) {
        lastActive = latestSession.updatedAt;
      }

      // Check if latest gym booking is more recent
      if (latestGymBooking && latestGymBooking.createdAt > lastActive) {
        lastActive = latestGymBooking.createdAt;
      }

      // Map client data to required format
      clientsData.push({
        id: user._id,
        name: user.name,
        email: user.email,
        membershipType: subscription ? subscription.planType : "Free",
        gym: gymName,
        joinDate: formatDate(clientProfile.bio?.joinedIn),
        status: gymRegistration ? gymRegistration.status : "inactive",
        lastActive: formatDate(lastActive),
        paymentStatus: subscription
          ? subscription.status === "Active"
            ? "Paid"
            : "Overdue"
          : "Pending",
        attendance: attendancePercentage,
      });
    }

    res.status(200).json(clientsData);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ message: "Failed to fetch clients" });
  }
};

module.exports = getClientsController;
