const express = require("express");
const router = express.Router();
const gymReviewController = require("../../controller/Gym_Owner/gymReviewController");

// Create a review
router.post("/", gymReviewController.createReview);

// Get all reviews for a gym
router.get("/:gymId", gymReviewController.getReviewsByGym);

// Optionally: Get single review by ID
router.get("/single/:reviewId", gymReviewController.getReviewById);

// Optionally: Delete review
router.delete("/:reviewId", gymReviewController.deleteReview);

module.exports = router;
