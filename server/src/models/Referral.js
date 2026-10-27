const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['created', 'sent', 'accepted', 'in_progress', 'completed', 'rejected'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    actor: {
      type: String,
      default: 'Authorized Medical Officer'
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    note: {
      type: String,
      default: ''
    }
  },
  { _id: false }
);

const referralSchema = new mongoose.Schema(
  {
    referralCode: {
      type: String,
      unique: true,
      sparse: true
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient reference is required'],
      index: true
    },
    referringFacility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: [true, 'Referring facility reference is required'],
      index: true
    },
    receivingFacility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: [true, 'Receiving facility reference is required'],
      index: true
    },
    referralReason: {
      type: String,
      required: [true, 'Referral clinical reason is required'],
      trim: true
    },
    provisionalDiagnosis: {
      type: String,
      trim: true,
      default: ''
    },
    urgencyLevel: {
      type: String,
      enum: ['Routine', 'Urgent', 'Emergency', 'Normal'],
      default: 'Routine'
    },
    vitals: {
      bloodPressure: String,
      pulse: Number,
      spo2: String,
      temp: String
    },
    status: {
      type: String,
      enum: ['created', 'sent', 'accepted', 'in_progress', 'completed', 'rejected'],
      default: 'created',
      lowercase: true,
      index: true
    },
    statusHistory: [statusHistorySchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Staff creator reference is required']
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

// Pre-save to auto-generate referralCode and seed initial statusHistory if empty
referralSchema.pre('save', function (next) {
  if (!this.referralCode) {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    this.referralCode = `REF-MH-${new Date().getFullYear()}-${randomDigits}`;
  }
  if (!this.statusHistory || this.statusHistory.length === 0) {
    this.statusHistory = [
      {
        status: this.status || 'created',
        timestamp: new Date(),
        actor: 'Initiating Healthcare Staff',
        actorId: this.createdBy,
        note: 'Referral case created in platform registry.'
      }
    ];
  }
  next();
});

// Indexes
referralSchema.index({ referringFacility: 1, receivingFacility: 1, status: 1 });
referralSchema.index({ patient: 1, createdAt: -1 });

const Referral = mongoose.model('Referral', referralSchema);
module.exports = Referral;
