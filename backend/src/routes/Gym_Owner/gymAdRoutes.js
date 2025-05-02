const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = require("../../middleware/upload");
const requireAuth = require("../../middleware/requireAuth");
const gymAdController = require("../../controller/Gym_Owner/gymAdController");

// Apply authentication middleware to all routes
router.use(requireAuth);

// Configure multer for ad image uploads
const adImageUpload = multer({
  storage: upload.storage,
  fileFilter: upload.fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Routes
// Get all ads for the logged-in gym owner
router.get("/", gymAdController.getOwnerAds);

// Get owner's approved gyms for ad creation
router.get("/approved-gyms", gymAdController.getApprovedGymsForAds);

// Get a specific ad by ID
router.get("/:id", gymAdController.getAdById);

// Create a new ad
router.post("/", adImageUpload.single("adImage"), gymAdController.createAd);

// Update an ad
router.patch("/:id", adImageUpload.single("adImage"), gymAdController.updateAd);

// Delete an ad
router.delete("/:id", gymAdController.deleteAd);

// Track ad view
router.post("/:id/view", gymAdController.trackAdView);

// Track ad click
router.post("/:id/click", gymAdController.trackAdClick);

// Create a public route for client ad display that doesn't require authentication
const publicRouter = express.Router();

// Get active ads for client display
publicRouter.get("/active", gymAdController.getActiveAdsForClient);
// Public endpoints for tracking ad view/click (no auth required)
publicRouter.post('/:id/view', gymAdController.trackAdView);
publicRouter.post('/:id/click', gymAdController.trackAdClick);

module.exports = { privateRouter: router, publicRouter };

