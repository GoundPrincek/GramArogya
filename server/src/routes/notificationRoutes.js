const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, notificationController.getMyNotifications);
router.put('/:id/read', protect, notificationController.markRead);
router.put('/read-all', protect, notificationController.markAllRead);

module.exports = router;
