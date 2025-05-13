const express = require("express");
const requireAuth = require("../../middleware/requireAuth");
const { getStats } = require("../../controller/Admin/stats/statsController");

const router = express.Router();

// Apply authentication middleware to admin stats route
// Uncomment the line below when you want to secure the endpoint
// router.use(requireAuth);

// Get admin dashboard statistics
router.get("/", getStats);

module.exports = router;
