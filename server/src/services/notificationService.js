const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');

const getUserNotifications = async (userId, limit = 50) => {
  return Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

const getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({ user: userId, isRead: false });
  return { unreadCount: count };
};

const markAsRead = async (id, userId) => {
  const notification = await Notification.findOne({ _id: id, user: userId });
  if (!notification) {
    throw new ApiError(404, 'Notification not found or access denied');
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  return notification;
};

const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  return { updatedCount: result.modifiedCount };
};

module.exports = {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead
};
