const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Facility name is required'],
      trim: true
    },
    facilityCode: {
      type: String,
      required: [true, 'Facility code is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    tier: {
      type: String,
      enum: ['SubCenter', 'PHC', 'CHC', 'SubDistrictHospital', 'DistrictHospital'],
      required: [true, 'Healthcare tier is required']
    },
    contact: {
      phone: { type: String, required: true },
      emergencyPhone: { type: String },
      email: { type: String }
    },
    address: {
      street: { type: String },
      village: { type: String },
      taluka: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, default: 'Maharashtra' },
      pincode: { type: String, required: true }
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    servicesAvailable: [{ type: String }],
    operationalHours: {
      opensAt: { type: String, default: '09:00' },
      closesAt: { type: String, default: '17:00' },
      is24x7Emergency: { type: Boolean, default: false }
    },
    parentFacilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// 2dsphere index for location-based nearest facility queries
facilitySchema.index({ location: '2dsphere' });
facilitySchema.index({ 'address.district': 1, 'address.taluka': 1, tier: 1 });

const Facility = mongoose.model('Facility', facilitySchema);
module.exports = Facility;
