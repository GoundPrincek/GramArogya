const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Get current user profile
 * @route   GET /api/users/me
 * @access  Private
 */
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('facilityId', 'name facilityType tier district taluka address');
  if (!user) {
    throw new ApiError(404, 'User profile not found');
  }

  res.status(200).json({
    success: true,
    data: user.toJSON()
  });
});

/**
 * @desc    Update current user profile (permitted fields only)
 * @route   PATCH /api/users/me
 * @access  Private
 */
const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, 'User profile not found');
  }

  const { name, phone, preferredLanguage, jurisdiction } = req.body;

  // Security: do NOT allow changing role, passwordHash, isActive, or administrative flags here
  if (name && typeof name === 'string') user.name = name.trim();
  if (phone && /^[6-9]\d{9}$/.test(phone)) {
    // Check if phone taken by another user
    const existing = await User.findOne({ phone: phone.trim(), _id: { $ne: user._id } });
    if (existing) {
      throw new ApiError(409, 'This mobile number is already registered to another user');
    }
    user.phone = phone.trim();
  }
  if (preferredLanguage && ['en', 'mr', 'hi'].includes(preferredLanguage)) {
    user.preferredLanguage = preferredLanguage;
  }
  if (jurisdiction && typeof jurisdiction === 'object') {
    user.jurisdiction = {
      ...user.jurisdiction,
      ...jurisdiction
    };
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user.toJSON()
  });
});

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/users
 * @access  Private (Admin)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, district, search } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (district) filter['jurisdiction.district'] = new RegExp(district, 'i');
  if (search) {
    const sRegex = new RegExp(search, 'i');
    filter.$or = [{ name: sRegex }, { phone: sRegex }, { email: sRegex }];
  }

  const users = await User.find(filter)
    .populate('facilityId', 'name facilityType tier district')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    message: 'Users retrieved successfully',
    data: users
  });
});

/**
 * @desc    Update user role or facility assignment (admin only)
 * @route   PATCH /api/users/:id/role
 * @access  Private (Admin)
 */
const updateUserRole = asyncHandler(async (req, res) => {
  const { role, facilityId, isActive } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (role) user.role = role;
  if (facilityId !== undefined) user.facilityId = facilityId;
  if (isActive !== undefined) user.isActive = Boolean(isActive);

  await user.save();

  await AuditLog.create({
    actor: req.user.id,
    action: 'USER_ROLE_UPDATED',
    resourceType: 'User',
    resourceId: user._id,
    metadata: { newRole: user.role, facilityId: user.facilityId, isActive: user.isActive }
  });

  res.status(200).json({
    success: true,
    message: 'User permissions updated successfully',
    data: user.toJSON()
  });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  updateUserRole
};
