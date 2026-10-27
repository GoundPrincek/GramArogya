const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    phone: {
      type: String,
      required: [true, '10-digit mobile number is required'],
      unique: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required']
    },
    role: {
      type: String,
      enum: ['patient', 'staff', 'doctor', 'asha_worker', 'admin'],
      default: 'patient',
      index: true
    },
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      default: null
    },
    jurisdiction: {
      state: { type: String, default: 'Maharashtra' },
      district: { type: String, trim: true },
      taluka: { type: String, trim: true },
      village: { type: String, trim: true }
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'mr', 'hi'],
      default: 'mr'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.passwordHash;
        delete ret.password;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.passwordHash;
        delete ret.password;
        return ret;
      }
    }
  }
);

// Virtual for password input
userSchema.virtual('password')
  .set(function (password) {
    this._password = password;
  })
  .get(function () {
    return this._password;
  });

// Pre-validate/save hook to hash password if provided
userSchema.pre('validate', async function (next) {
  if (this._password) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this._password, salt);
  }
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(enteredPassword, this.passwordHash);
};

// Email has sparse: true and Phone has unique: true which automatically create their indexes

const User = mongoose.model('User', userSchema);
module.exports = User;
