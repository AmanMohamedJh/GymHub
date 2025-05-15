const express = require("express");
const router = express.Router();
const gymReviewController = require("../../controller/Gym_Owner/gymReviewController");
const requireAuth = require("../../middleware/requireAuth");

// Create a review
router.post("/", gymReviewController.createReview);

// Get all gyms owned by the owner that have at least one review
router.get(
  "/gyms-with-reviews",
  requireAuth,
  gymReviewController.getOwnerGymsWithReviews
);

// Get all reviews for a gym
router.get("/:gymId", gymReviewController.getReviewsByGym);

// Optionally: Get single review by ID
router.get("/single/:reviewId", gymReviewController.getReviewById);

// Optionally: Delete review
router.delete("/:reviewId", gymReviewController.deleteReview);

// PATCH: Add/update owner response to a review
router.patch("/:id/response", requireAuth, gymReviewController.replyToReview);

module.exports = router;
