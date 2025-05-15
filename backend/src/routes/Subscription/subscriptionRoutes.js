const express = require('express');
const router = express.Router();
const requireAuth = require('../../middleware/requireAuth');
const subscriptionController = require('../../controller/Subscription/subscriptionController');

// Create a checkout session
router.post('/create-checkout-session', requireAuth, subscriptionController.createCheckoutSession);

// Get user's subscription
router.get('/user-subscription', requireAuth, subscriptionController.getUserSubscription);

// Cancel subscription
router.post('/cancel', requireAuth, subscriptionController.cancelSubscription);

// Webhook endpoint is handled in server.js

module.exports = router;
