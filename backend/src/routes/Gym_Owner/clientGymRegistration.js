const express = require("express");
const router = express.Router();
const gymOwnerRouter = express.Router();
const clientGymRegistrationController = require("../../controller/Gym_Owner/clientGymRegistrationController");
const requireAuth = require("../../middleware/requireAuth");

// POST: Client registers for a gym
router.post(
  "/gyms/:gymId/Clientregister",
  requireAuth,
  clientGymRegistrationController.registerClientToGym
);

// POST: Client registers for a gym (for /api/gymOwner/...)
gymOwnerRouter.post(
  "/gyms/:gymId/Clientregister",
  requireAuth,
  clientGymRegistrationController.registerClientToGym
);

// GET: All client registrations for a gym (for gym owner dashboard)
router.get(
  "/gyms/:gymId/Clientregistrations",
  requireAuth,
  clientGymRegistrationController.getGymClientRegistrations
);

// GET: All gym registrations for a user (optional)
router.get(
  "/users/:userId/ClientGymRegistrations",
  requireAuth,
  clientGymRegistrationController.getUserClientRegistrations
);

// Check client registration status for a gym
router.get(
  "/gyms/:gymId/client-status",
  requireAuth,
  clientGymRegistrationController.getClientGymStatus
);

// GET: Check if a client has joined a gym (any status)
router.get(
  "/gyms/:gymId/has-joined/:clientId",
  clientGymRegistrationController.checkClientJoined
);

// PATCH: Update client registration status
router.patch(
  "/gyms/:gymId/Clientregistrations/:registrationId",
  requireAuth,
  clientGymRegistrationController.updateClientRegistrationStatus
);

gymOwnerRouter.patch(
  "/gyms/:gymId/Clientregistrations/:registrationId",
  requireAuth,
  clientGymRegistrationController.updateClientRegistrationStatus
);

// DELETE: Remove client registration
router.delete(
  "/gyms/:gymId/Clientregistrations/:registrationId",
  requireAuth,
  clientGymRegistrationController.deleteClientRegistration
);

// GYM OWNER ROUTES
// Duplicate for /api/gymOwner
// GET: All client registrations for a gym (for gym owner dashboard)
gymOwnerRouter.get(
  "/gyms/:gymId/Clientregistrations",
  requireAuth,
  clientGymRegistrationController.getGymClientRegistrations
);
// Check client registration status for a gym
gymOwnerRouter.get(
  "/gyms/:gymId/client-status",
  requireAuth,
  clientGymRegistrationController.getClientGymStatus
);

module.exports = { router, gymOwnerRouter };
