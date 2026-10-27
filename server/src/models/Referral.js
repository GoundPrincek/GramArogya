const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    fromFacilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true
    },
    toFacilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true
    },
    referringDoctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    urgencyLevel: {
      type: String,
      enum: ['Normal', 'Urgent', 'Emergency'],
      default: 'Normal'
    },
    reasonForReferral: {
      type: String,
      required: [true, 'Reason for referral is required']
    },
    provisionalDiagnosis: {
      type: String,
      required: [true, 'Provisional diagnosis is required']
    },
    vitals: {
      bloodPressure: String,
      pulseRate: Number,
      spo2: Number,
      temperature: Number
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'EnRoute', 'Arrived', 'Completed', 'Rejected'],
      default: 'Pending'
    },
    receivingDoctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    actionNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

referralSchema.index({ toFacilityId: 1, status: 1, urgencyLevel: 1 });
referralSchema.index({ patientId: 1, createdAt: -1 });

const Referral = mongoose.model('Referral', referralSchema);
module.exports = Referral;
