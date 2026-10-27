const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result
  });
});

/**
 * @desc    Authenticate user and get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result
  });
});

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  res.status(200).json({
    success: true,
    message: 'Profile fetched successfully',
    data: user
  });
});

module.exports = {
  register,
  login,
  getMe
};
