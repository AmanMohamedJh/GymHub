const express = require("express");
const requireAuth = require("../../middleware/requireAuth");
const adminControllers = require("../../controller/Admin/index");

const router = express.Router();

// Apply authentication middleware to all admin routes
// router.use(requireAuth);

// Admin client routes
router.get("/", adminControllers.getClientsController);
// Route for updating a client's profile
router.put("/:id/profile", adminControllers.updateClientProfileController);
// Route for updating a client's status
router.put("/:id/status", adminControllers.updateClientStatusController);
// Route for deleting a client
router.delete("/:id", adminControllers.deleteClientController);

module.exports = router;
