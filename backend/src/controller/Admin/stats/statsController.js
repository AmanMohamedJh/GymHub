const User = require("../../../models/userModel");
const Client = require("../../../models/Client/clientModel");
const Gym = require("../../../models/Gym_Owner/Gym");
const TrainerRegistration = require("../../../models/Trainer/TrainerRegistration");
const ContactUs = require("../../../models/Contactus/contactUsModel");
const Subscription = require("../../../models/Subscription/SubscriptionModel");

// Helper function to calculate growth percentage
const calculateGrowth = (currentCount, previousCount) => {
  if (previousCount === 0) return 100; // If previous count was 0, consider 100% growth
  return Math.round(((currentCount - previousCount) / previousCount) * 100);
};

// Get admin dashboard statistics
const getStats = async (req, res) => {
  try {
    // Get current date and date 30 days ago for growth calculations
    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(currentDate.getDate() - 60);

    // Get total counts
    const totalClients = await User.countDocuments({ role: "client" });
    const totalGyms = await Gym.countDocuments();
    const activeGyms = await Gym.countDocuments({ status: "approved" });
    const totalTrainers = await User.countDocuments({ role: "trainer" });

    // Get pending counts
    const pendingClients = await Client.countDocuments({
      "bio.joinedIn": { $gte: thirtyDaysAgo },
    });
    const pendingGyms = await Gym.countDocuments({ status: "pending" });
    const pendingTrainers = await TrainerRegistration.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });
    // Get unread messages count
    const unreadMessages = await ContactUs.countDocuments();

    // Get new registrations in last 30 days - since User model may not have createdAt,
    // we'll estimate from Client model's joinedIn field
    const newRegisters = await Client.countDocuments({
      "bio.joinedIn": { $gte: thirtyDaysAgo },
    });
    // Calculate revenue from subscriptions
    const subscriptions = await Subscription.find({
      status: "Active",
    });

    let totalRevenue = 0;
    if (subscriptions && subscriptions.length > 0) {
      totalRevenue = subscriptions.reduce((sum, sub) => {
        // Assuming Monthly plan is $25 and Yearly is $250
        if (sub.planType === "Monthly") return sum + 25;
        if (sub.planType === "Yearly") return sum + 250;
        return sum;
      }, 0);
    }
    // Get counts from 30-60 days ago for growth calculations
    const clientsLastMonth = await Client.countDocuments({
      "bio.joinedIn": { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
    });

    const gymsLastMonth = await Gym.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
    });

    const trainersLastMonth = await TrainerRegistration.countDocuments({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
    });
    // Get revenue from previous month
    const prevSubscriptions = await Subscription.find({
      createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo },
      status: "Active",
    });

    let prevRevenue = 0;
    if (prevSubscriptions && prevSubscriptions.length > 0) {
      prevRevenue = prevSubscriptions.reduce((sum, sub) => {
        if (sub.planType === "Monthly") return sum + 25;
        if (sub.planType === "Yearly") return sum + 250;
        return sum;
      }, 0);
    }

    // Calculate growth percentages
    const clientGrowth = calculateGrowth(
      totalClients - clientsLastMonth,
      clientsLastMonth
    );

    const gymGrowth = calculateGrowth(totalGyms - gymsLastMonth, gymsLastMonth);

    const trainerGrowth = calculateGrowth(
      totalTrainers - trainersLastMonth,
      trainersLastMonth
    );

    const revenueGrowth = calculateGrowth(totalRevenue, prevRevenue);

    // Return the stats
    res.status(200).json({
      totalClients,
      activeGyms,
      totalTrainers,
      pendingClients,
      pendingGyms,
      pendingTrainers,
      unreadMessages,
      totalRevenue,
      clientGrowth,
      gymGrowth,
      trainerGrowth,
      revenueGrowth,
      newRegister: newRegisters,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ error: "Failed to fetch admin statistics" });
  }
};

module.exports = { getStats };
