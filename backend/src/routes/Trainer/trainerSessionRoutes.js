const express = require('express');
const router = express.Router();
const requireAuth = require('../../middleware/requireAuth');
const trainerSessionController = require('../../controller/Trainer/trainerSessionController');

// PUBLIC: Get all sessions for a trainer by user id
router.get('/public/user/:userId', trainerSessionController.getSessionsByTrainerUserId);

// Public: Get all active sessions for a specific trainer registration
router.get('/active/:trainerId', trainerSessionController.getActiveSessionsByTrainer);

// All routes require authentication
router.use(requireAuth);

// Add a new session
router.post('/add', trainerSessionController.addSession);

// Update a session
router.put('/:id', trainerSessionController.updateSession);

// Delete a session
router.delete('/:id', trainerSessionController.deleteSession);

// Get all sessions for the logged-in trainer
router.get('/my-sessions', trainerSessionController.getMySessions);

module.exports = router;
