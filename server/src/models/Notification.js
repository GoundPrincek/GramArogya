const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true
    },
    type: {
      type: String,
      enum: [
        'appointment',
        'referral',
        'broadcast',
        'system',
        'APPOINTMENT_REMINDER',
        'REFERRAL_UPDATE',
        'EMERGENCY_ALERT'
      ],
      default: 'system'
    },
    relatedResource: {
      resourceType: {
        type: String,
        enum: ['Appointment', 'Referral', 'Facility', 'User', null],
        default: null
      },
      resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      }
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    },
    readAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual alias for backward compatibility
notificationSchema.virtual('recipientId').get(function () {
  return this.user;
});

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
