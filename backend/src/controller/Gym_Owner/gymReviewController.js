const GymReview = require('../../models/Gym_Owner/GymReview');
const ClientGymRegistration = require('../../models/Gym_Owner/ClientGymRegistration');

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
    const reviews = await GymReview.find({ gymId: req.params.gymId })
      .populate('clientId', 'name');

    // For joined date, fetch registration for each client/gym
    const reviewsWithJoinDate = await Promise.all(reviews.map(async (review) => {
      let joined = null;
      try {
        const reg = await ClientGymRegistration.findOne({
          gymId: review.gymId,
          clientId: review.clientId?._id || review.clientId
        });
        if (reg && reg.startDate) {
          joined = reg.startDate.toISOString().split('T')[0];
        } else if (reg && reg.createdAt) {
          joined = reg.createdAt.toISOString().split('T')[0];
        }
      } catch {}
      return {
        ...review.toObject(),
        clientName: review.clientId?.name || 'Client',
        clientJoined: joined
      };
    }));
    res.json(reviewsWithJoinDate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Optionally: Get a single review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await GymReview.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Optionally: Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const review = await GymReview.findByIdAndDelete(req.params.reviewId);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
