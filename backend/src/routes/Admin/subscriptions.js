const express = require("express");
const router = express.Router();
const requireAuth = require("../../middleware/requireAuth");
const adminControllers = require("../../controller/Admin/index");

// Apply authentication middleware to all admin routes
router.use(requireAuth);

// Get all subscription plans
router.get("/plans", adminControllers.getSubscriptionPlans);

// Get all subscriptions
router.get("/", adminControllers.getAllSubscriptions);

// Get subscription by ID
router.get("/:id", adminControllers.getSubscriptionById);

// Update subscription price
router.put("/:id/update-price", adminControllers.updateSubscriptionPrice);

// Update subscription status
router.put("/update-status", adminControllers.updateSubscriptionStatus);

module.exports = router;
