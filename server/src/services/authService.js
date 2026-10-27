/**
 * Authentication Service
 * Encapsulates user registration, login, credential verification, and token creation logic.
 */
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');

const registerUser = async (userData) => {
  const existingUser = await User.findOne({ phone: userData.phone });
  if (existingUser) {
    throw new ApiError(409, 'User with this mobile number already exists');
  }

  const user = await User.create(userData);

  const token = generateToken({
    id: user._id,
    role: user.role,
    phone: user.phone,
    facilityId: user.facilityId
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      facilityId: user.facilityId,
      preferredLanguage: user.preferredLanguage
    },
    token
  };
};

const loginUser = async ({ identifier, password }) => {
  // Support login via either mobile number or email
  const user = await User.findOne({
    $or: [{ phone: identifier }, { email: identifier.toLowerCase() }]
  });

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid mobile number/email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is deactivated. Contact district health administration.');
  }

  const token = generateToken({
    id: user._id,
    role: user.role,
    phone: user.phone,
    facilityId: user.facilityId
  });

  return {
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      facilityId: user.facilityId,
      preferredLanguage: user.preferredLanguage
    },
    token
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select('-password').populate('facilityId', 'name tier address');
  if (!user) {
    throw new ApiError(404, 'User profile not found');
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser
};
