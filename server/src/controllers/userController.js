const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/users
 * @access  Private (Admin)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, district } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (district) filter['jurisdiction.district'] = district;

  const users = await User.find(filter)
    .select('-password')
    .populate('facilityId', 'name tier')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Users retrieved successfully',
    data: users
  });
});

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private (Admin / Self)
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password')
    .populate('facilityId', 'name tier address');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json({
    success: true,
    message: 'User retrieved successfully',
    data: user
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/users/:id
 * @access  Private (Admin / Self)
 */
const updateUser = asyncHandler(async (req, res) => {
  const { name, preferredLanguage, jurisdiction } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (name) user.name = name;
  if (preferredLanguage) user.preferredLanguage = preferredLanguage;
  if (jurisdiction) user.jurisdiction = { ...user.jurisdiction, ...jurisdiction };

  await user.save();

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      preferredLanguage: user.preferredLanguage,
      jurisdiction: user.jurisdiction
    }
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUser
};
