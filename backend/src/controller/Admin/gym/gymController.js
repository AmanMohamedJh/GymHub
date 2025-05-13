const Gym = require("../../../models/Gym_Owner/Gym");
const GymReview = require("../../../models/Gym_Owner/GymReview");
const ClientGymRegistration = require("../../../models/Gym_Owner/ClientGymRegistration");

// Get all gyms with additional info (members count and average rating)
const getGyms = async (req, res) => {
  try {
    // Get all gyms
    const gyms = await Gym.find().lean();

    // Create an array to hold the final results
    const gymsWithDetails = [];

    // For each gym, get the additional details
    for (const gym of gyms) {
      // Calculate average rating from GymReview
      const reviews = await GymReview.find({ gymId: gym._id });
      let rating = 0;
      if (reviews.length > 0) {
        const totalRating = reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        rating = parseFloat((totalRating / reviews.length).toFixed(1));
      }

      // Count members from ClientGymRegistration
      const activeMembers = await ClientGymRegistration.countDocuments({
        gymId: gym._id,
        status: "active",
      });

      // Format location
      const location = gym.location
        ? `${gym.location.street ? gym.location.street + ", " : ""}${
            gym.location.city || ""
          }${gym.location.district ? ", " + gym.location.district : ""}`
        : "No location specified";

      // Add to results array
      gymsWithDetails.push({
        id: gym._id,
        name: gym.name,
        location: location,
        status: gym.status,
        members: activeMembers,
        rating: rating,
      });
    }

    return res.status(200).json(gymsWithDetails);
  } catch (error) {
    console.error("Error in getGyms:", error);
    return res.status(500).json({ message: "Failed to fetch gyms" });
  }
};

module.exports = getGyms;
