const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');

const registerUser = async (userData) => {
  const query = [{ phone: userData.phone }];
  if (userData.email) {
    query.push({ email: userData.email.toLowerCase() });
  }

  const existingUser = await User.findOne({ $or: query });
  if (existingUser) {
    if (existingUser.phone === userData.phone) {
      throw new ApiError(409, 'A user with this mobile number already exists');
    }
    if (userData.email && existingUser.email === userData.email.toLowerCase()) {
      throw new ApiError(409, 'A user with this email address already exists');
    }
  }

  // Enforce role = patient for public registration
  const user = new User({
    name: userData.name,
    phone: userData.phone,
    email: userData.email ? userData.email.toLowerCase() : undefined,
    password: userData.password,
    role: 'patient',
    preferredLanguage: userData.preferredLanguage || 'mr',
    jurisdiction: userData.jurisdiction || { state: 'Maharashtra' }
  });

  await user.save();

  const token = generateToken({
    id: user._id,
    role: user.role,
    phone: user.phone,
    facilityId: user.facilityId
  });

  return {
    user: user.toJSON(),
    token
  };
};

const loginUser = async ({ identifier, password }) => {
  // Support login via either mobile number or email
  const cleanIdentifier = identifier.trim();
  const isEmail = cleanIdentifier.includes('@');

  const user = await User.findOne(
    isEmail
      ? { email: cleanIdentifier.toLowerCase() }
      : { phone: cleanIdentifier }
  );

  // Return consistent error for invalid credentials
  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid mobile number/email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated. Please contact district health administration.');
  }

  const token = generateToken({
    id: user._id,
    role: user.role,
    phone: user.phone,
    facilityId: user.facilityId
  });

  return {
    user: user.toJSON(),
    token
  };
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).populate('facilityId', 'name facilityType tier district taluka address');
  if (!user) {
    throw new ApiError(404, 'User profile not found');
  }
  return user.toJSON();
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser
};
