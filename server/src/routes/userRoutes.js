const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, authorize('admin'), userController.getAllUsers);
router.get('/:id', protect, userController.getUserById);
router.put('/:id', protect, userController.updateUser);

module.exports = router;
