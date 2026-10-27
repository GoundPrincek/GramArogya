const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, '10-digit mobile number is required'],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['patient', 'asha_worker', 'doctor', 'staff', 'admin'],
      default: 'patient'
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
    timestamps: true
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
