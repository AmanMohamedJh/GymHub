const express = require('express');
const router = express.Router();
const requireAuth = require('../../middleware/requireAuth');
const trainerTipsController = require('../../controller/Trainer/trainerTipsController');

// All routes require authentication
router.use(requireAuth);

// Add a new tip
router.post('/', trainerTipsController.addTrainerTip);

// Get all tips (for all users)
router.get('/all', trainerTipsController.getAllTrainerTips);

// Get tips by the logged-in trainer
router.get('/my', trainerTipsController.getTrainerTipsByTrainer);

// Add a reply to a tip
router.post('/:tipId/replies', trainerTipsController.addReplyToTip);

// Edit a tip
router.put('/:tipId', trainerTipsController.editTrainerTip);

// Delete a tip
router.delete('/:tipId', trainerTipsController.deleteTrainerTip);

module.exports = router;
