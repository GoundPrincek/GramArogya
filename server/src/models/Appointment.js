const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient reference is required'],
      index: true
    },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: [true, 'Facility reference is required'],
      index: true
    },
    requestedService: {
      type: String,
      required: [true, 'Requested service is required'],
      trim: true
    },
    preferredDate: {
      type: Date,
      required: [true, 'Preferred appointment date is required']
    },
    preferredTime: {
      type: String,
      required: [true, 'Preferred appointment time slot is required'],
      trim: true
    },
    tokenNumber: {
      type: Number,
      default: 1
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
      lowercase: true,
      index: true
    },
    decisionReason: {
      type: String,
      default: '',
      trim: true
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    consultationNotes: {
      type: String,
      default: '',
      trim: true
    },
    isDemoData: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual aliases for compatibility
appointmentSchema.virtual('patientId').get(function () {
  return this.patient;
});

appointmentSchema.virtual('facilityId').get(function () {
  return this.facility;
});

// Indexes
appointmentSchema.index({ facility: 1, preferredDate: 1, status: 1 });
appointmentSchema.index({ patient: 1, preferredDate: -1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
