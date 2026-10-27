/**
 * Notification Service
 * Handles user alerts, SMS dispatch triggers, and in-app notifications.
 */
const Notification = require('../models/Notification');

const createNotification = async (notificationData) => {
  return Notification.create(notificationData);
};

const getUserNotifications = async (recipientId) => {
  return Notification.find({ recipientId })
    .sort({ createdAt: -1 })
    .limit(50);
};

const markAsRead = async (notificationId, recipientId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, recipientId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
};

const markAllAsRead = async (recipientId) => {
  return Notification.updateMany(
    { recipientId, isRead: false },
    { isRead: true, readAt: new Date() }
  );
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead
};
