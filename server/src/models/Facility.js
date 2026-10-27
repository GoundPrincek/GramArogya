const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Facility name is required'],
      trim: true,
      index: true
    },
    facilityCode: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true
    },
    facilityType: {
      type: String,
      enum: ['SubCenter', 'PHC', 'CHC', 'SubDistrictHospital', 'DistrictHospital'],
      required: [true, 'Facility type is required'],
      index: true
    },
    address: {
      type: String,
      trim: true
    },
    village: {
      type: String,
      trim: true,
      index: true
    },
    taluka: {
      type: String,
      trim: true,
      index: true
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
      index: true
    },
    state: {
      type: String,
      default: 'Maharashtra'
    },
    pincode: {
      type: String,
      trim: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [73.98, 18.58],
      validate: {
        validator: function (val) {
          if (!val || val.length === 0) return true;
          return (
            Array.isArray(val) &&
            val.length === 2 &&
            val[0] >= -180 &&
            val[0] <= 180 &&
            val[1] >= -90 &&
            val[1] <= 90
          );
        },
        message: 'Coordinates must be valid [longitude, latitude]'
      }
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [74.0, 19.0]
      }
    },
    services: [
      {
        type: String,
        trim: true
      }
    ],
    contactInformation: {
      phone: { type: String, trim: true },
      emergencyPhone: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true }
    },
    operatingHours: {
      opensAt: { type: String, default: '09:00 AM' },
      closesAt: { type: String, default: '05:00 PM' },
      is24x7Emergency: { type: Boolean, default: false }
    },
    isDemoData: {
      type: Boolean,
      default: true
    },
    verificationNote: {
      type: String,
      default: 'Synthetic demonstration facility profile for Maharashtra public healthcare coordination.'
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual alias 'tier' for backwards compatibility
facilitySchema.virtual('tier')
  .get(function () {
    return this.facilityType;
  })
  .set(function (val) {
    this.facilityType = val;
  });

// Virtual alias 'servicesAvailable'
facilitySchema.virtual('servicesAvailable')
  .get(function () {
    return this.services;
  })
  .set(function (val) {
    this.services = val;
  });

// Pre-save to sync coordinates to GeoJSON Point location
facilitySchema.pre('save', function (next) {
  if (this.coordinates && this.coordinates.length === 2) {
    this.location = {
      type: 'Point',
      coordinates: this.coordinates
    };
  } else if (this.location && this.location.coordinates) {
    this.coordinates = this.location.coordinates;
  }
  next();
});

// Indexes for text search, filtering, and geospatial queries
facilitySchema.index({ name: 'text', village: 'text', taluka: 'text', address: 'text' });
facilitySchema.index({ location: '2dsphere' });
facilitySchema.index({ district: 1, facilityType: 1, isActive: 1 });

const Facility = mongoose.model('Facility', facilitySchema);
module.exports = Facility;
