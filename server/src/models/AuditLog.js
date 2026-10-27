const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Actor reference is required'],
      index: true
    },
    action: {
      type: String,
      required: [true, 'Audit action name is required'],
      trim: true
    },
    resourceType: {
      type: String,
      required: [true, 'Resource type is required'],
      trim: true,
      index: true
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: false
  }
);

// Virtual alias actorId
auditLogSchema.virtual('actorId').get(function () {
  return this.actor;
});

auditLogSchema.index({ resourceType: 1, resourceId: 1, timestamp: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;
