const express = require("express");
const requireAuth = require("../../middleware/requireAuth");
const adminControllers = require("../../controller/Admin/index");

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(requireAuth);

// Get all contact messages
router.get("/contact-messages", adminControllers.getContactMessages);

// Delete a contact message
router.delete("/contact-messages/:id", adminControllers.deleteContactMessage);

// Reply to a contact message
router.post(
  "/contact-messages/:id/reply",
  adminControllers.replyToContactMessage
);

module.exports = router;
