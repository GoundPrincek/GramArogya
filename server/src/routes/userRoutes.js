const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

// Current user profile management
router.get('/me', userController.getMyProfile);
router.patch('/me', userController.updateMyProfile);

// Administrator management
router.get('/', authorize('admin'), userController.getAllUsers);
router.patch('/:id/role', authorize('admin'), userController.updateUserRole);

module.exports = router;
