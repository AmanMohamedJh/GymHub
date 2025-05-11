const express = require('express');
const router = express.Router();
const requireAuth = require('../../middleware/requireAuth');
const controller = require('../../controller/Client/ClientTrainerSessionsController');

// Join a session
router.post('/join', requireAuth, controller.joinSession);

// Get all bookings for a session
router.get('/:sessionBookingId', requireAuth, controller.getSessionBookings);

// Get all sessions for a client
router.get('/client/:clientId', requireAuth, controller.getClientSessions);

// Get all joined TrainerSessions for a client, with real session data
router.get('/client/:clientId/full', requireAuth, controller.getClientJoinedTrainerSessions);

// Cancel a session booking
router.patch('/cancel/:id', requireAuth, controller.cancelSession);

module.exports = router;
