const asyncHandler = require('../utils/asyncHandler');
const Facility = require('../models/Facility');
const Appointment = require('../models/Appointment');
const Referral = require('../models/Referral');
const User = require('../models/User');

/**
 * @desc    Get aggregated platform statistics
 * @route   GET /api/dashboard/stats
 * @access  Private (Staff / Admin)
 */
const getStats = asyncHandler(async (req, res) => {
  const [totalFacilities, totalPatients, totalAppointments, activeReferrals] = await Promise.all([
    Facility.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'patient' }),
    Appointment.countDocuments(),
    Referral.countDocuments({ status: { $in: ['Pending', 'Accepted', 'EnRoute'] } })
  ]);

  res.status(200).json({
    success: true,
    message: 'Dashboard statistics retrieved successfully',
    data: {
      totalFacilities,
      totalPatients,
      totalAppointments,
      activeReferrals,
      districtsCovered: 36 // Maharashtra total districts
    }
  });
});

/**
 * @desc    Get contextual overview depending on user role
 * @route   GET /api/dashboard/overview
 * @access  Private
 */
const getOverview = asyncHandler(async (req, res) => {
  const { role, id } = req.user;

  let overviewData = {};
  if (role === 'patient') {
    const upcomingAppointments = await Appointment.find({
      patientId: id,
      status: { $in: ['Scheduled', 'Confirmed'] }
    }).populate('facilityId', 'name tier').limit(5);

    overviewData = { upcomingAppointments };
  } else {
    overviewData = {
      message: `Welcome to the ${role.toUpperCase()} operational console`
    };
  }

  res.status(200).json({
    success: true,
    message: 'Dashboard overview retrieved successfully',
    data: overviewData
  });
});

module.exports = {
  getStats,
  getOverview
};
