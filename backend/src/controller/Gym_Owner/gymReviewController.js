const GymReview = require("../../models/Gym_Owner/GymReview");
const ClientGymRegistration = require("../../models/Gym_Owner/ClientGymRegistration");
const Gym = require("../../models/Gym_Owner/Gym");

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const review = new GymReview(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all reviews for a gym
exports.getReviewsByGym = async (req, res) => {
  try {
    // Populate clientId (User) and also fetch joined date from registration
    const reviews = await GymReview.find({ gymId: req.params.gymId }).populate(
      "clientId",
      "name email"
    );

    // For joined date and full name, fetch registration for each client/gym
    const reviewsWithJoinDate = await Promise.all(
      reviews.map(async (review) => {
        let joined = null;
        let fullName = review.clientId?.name || "";
        try {
          const reg = await ClientGymRegistration.findOne({
            gymId: review.gymId,
            clientId: review.clientId?._id || review.clientId,
          });
          if (reg) {
            if (reg.startDate) {
              joined = reg.startDate.toISOString().split("T")[0];
            } else if (reg.createdAt) {
              joined = reg.createdAt.toISOString().split("T")[0];
            }
            if (reg.fullName) {
              fullName = reg.fullName;
            }
          }
        } catch {}
        return {
          ...review.toObject(),
          clientName: fullName || "Unknown",
          clientEmail: review.clientId?.email || "",
          clientJoined: joined,
          heading: review.heading,
          content: review.content,
          rating: review.rating,
          emoji: review.emoji,
          date: review.date,
          categoryRatings: review.categoryRatings,
        };
      })
    );
    res.json(reviewsWithJoinDate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Optionally: Get a single review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await GymReview.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Optionally: Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const review = await GymReview.findByIdAndDelete(req.params.reviewId);
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH: Owner reply to a review
exports.replyToReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    if (!response || typeof response !== "string") {
      return res.status(400).json({ error: "Response text is required." });
    }
    const review = await GymReview.findByIdAndUpdate(
      id,
      { response },
      { new: true }
    );
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json({ message: "Reply added successfully", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all gyms owned by the logged-in owner that have at least one review
exports.getOwnerGymsWithReviews = async (req, res) => {
  try {
    console.log("Decoded req.user:", req.user);
    const ownerId = req.user && req.user._id;
    if (!ownerId) {
      console.error("No ownerId found in req.user");
      return res.status(401).json({ error: "Unauthorized: No ownerId" });
    }
    // Find all gyms owned by this owner
    const gyms = await Gym.find({ ownerId, status: "approved" });
    console.log("Fetched gyms:", gyms);
    if (!gyms || gyms.length === 0) {
      return res.status(200).json([]); // No gyms found, return empty array
    }
    // For each gym, check if it has reviews
    const gymsWithReviews = [];
    for (const gym of gyms) {
      // Populate clientId with name and email
      const reviews = await GymReview.find({ gymId: gym._id }).populate(
        "clientId",
        "name email"
      );
      // For each review, fetch joined date and enrich with all relevant data
      const enrichedReviews = await Promise.all(
        reviews.map(async (review) => {
          let joined = null;
          let fullName = review.clientId?.name || "";
          try {
            const reg = await ClientGymRegistration.findOne({
              gymId: review.gymId,
              clientId: review.clientId?._id || review.clientId,
            });
            if (reg) {
              if (reg.startDate) {
                joined = reg.startDate.toISOString().split("T")[0];
              } else if (reg.createdAt) {
                joined = reg.createdAt.toISOString().split("T")[0];
              }
              if (reg.fullName) {
                fullName = reg.fullName;
              }
            }
          } catch {}
          // Compose the review object for dashboard
          return {
            _id: review._id,
            clientName: fullName || "Unknown",
            clientEmail: review.clientId?.email || "",
            clientJoined: joined,
            heading: review.heading,
            content: review.content,
            rating: review.rating,
            emoji: review.emoji,
            date: review.date,
            categoryRatings: review.categoryRatings,
            response: review.response, // Added
          };
        })
      );
      if (enrichedReviews.length > 0) {
        gymsWithReviews.push({
          ...gym.toObject(),
          reviews: enrichedReviews,
        });
      }
    }
    // If no gyms with reviews, return empty array
    console.log("Returning gymsWithReviews:", gymsWithReviews.length);
    return res.status(200).json(gymsWithReviews);
  } catch (err) {
    console.error("Error in getOwnerGymsWithReviews:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createReview: exports.createReview,
  getReviewsByGym: exports.getReviewsByGym,
  getReviewById: exports.getReviewById,
  deleteReview: exports.deleteReview,
  replyToReview: exports.replyToReview,
  getOwnerGymsWithReviews: exports.getOwnerGymsWithReviews,
};
