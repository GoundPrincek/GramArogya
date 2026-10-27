const asyncHandler = require('../utils/asyncHandler');
const notificationService = require('../services/notificationService');

/**
 * @desc    Get notifications for logged-in user
 * @route   GET /api/notifications
 * @access  Private
 */
const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.getUserNotifications(req.user.id);
  res.status(200).json({
    success: true,
    message: 'Notifications retrieved successfully',
    data: notifications
  });
});

/**
 * @desc    Mark single notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
const markRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user.id);
  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: notification
  });
});

/**
 * @desc    Mark all user notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
const markAllRead = asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);
  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

module.exports = {
  getMyNotifications,
  markRead,
  markAllRead
};
