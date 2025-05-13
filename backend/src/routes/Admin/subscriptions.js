const express = require("express");
const router = express.Router();
const requireAuth = require("../../middleware/requireAuth");
const adminControllers = require("../../controller/Admin/index");

// Apply authentication middleware to all admin routes
router.use(requireAuth);

// Get all subscriptions
router.get("/", adminControllers.getAllSubscriptions);

// Update subscription price
router.put("/:id/update-price", adminControllers.updateSubscriptionPrice);

module.exports = router;
