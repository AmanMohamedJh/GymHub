const express = require('express');
const router = express.Router();
const requireAuth = require('../../middleware/requireAuth');
const upload = require('../../middleware/upload');
const trainerRegistrationController = require('../../controller/Trainer/trainerRegistrationController');

// Get all trainers (public)
router.get('/all', trainerRegistrationController.getAllTrainers);

// All routes require authentication
router.use(requireAuth);

// Register as trainer
router.post('/register', upload.single('certificate'), trainerRegistrationController.registerTrainer);

// Update current user's registration
router.put('/me', upload.single('certificate'), trainerRegistrationController.updateMyTrainerRegistration);

// Get current user's registration
router.get('/me', trainerRegistrationController.getMyTrainerRegistration);

// Delete current user's registration
router.delete('/me', trainerRegistrationController.deleteMyTrainerRegistration);

module.exports = router;
