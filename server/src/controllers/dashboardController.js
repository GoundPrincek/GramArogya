const asyncHandler = require('../utils/asyncHandler');
const Facility = require('../models/Facility');
const Appointment = require('../models/Appointment');
const Referral = require('../models/Referral');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Patient personal dashboard data
 * @route   GET /api/dashboard/patient
 * @access  Private (Patient / Admin)
 */
const getPatientDashboard = asyncHandler(async (req, res) => {
  const patientId = req.user.id;

  const [
    totalAppointments,
    pendingAppointments,
    acceptedAppointments,
    activeReferrals,
    unreadNotifications,
    upcomingAppointments,
    recentReferrals
  ] = await Promise.all([
    Appointment.countDocuments({ patient: patientId }),
    Appointment.countDocuments({ patient: patientId, status: 'pending' }),
    Appointment.countDocuments({ patient: patientId, status: 'accepted' }),
    Referral.countDocuments({
      patient: patientId,
      status: { $in: ['created', 'sent', 'accepted', 'in_progress'] }
    }),
    Notification.countDocuments({ user: patientId, isRead: false }),
    Appointment.find({
      patient: patientId,
      status: { $in: ['pending', 'accepted'] }
    })
      .populate('facility', 'name facilityType tier district taluka village address')
      .sort({ preferredDate: 1 })
      .limit(3),
    Referral.find({ patient: patientId })
      .populate('referringFacility', 'name facilityType tier district taluka')
      .populate('receivingFacility', 'name facilityType tier district taluka')
      .sort({ createdAt: -1 })
      .limit(3)
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalAppointments,
        pendingAppointments,
        acceptedAppointments,
        activeReferrals,
        unreadNotifications
      },
      upcomingAppointments,
      recentReferrals
    }
  });
});

/**
 * @desc    Healthcare Staff operational dashboard
 * @route   GET /api/dashboard/staff
 * @access  Private (Staff / Doctor / Admin)
 */
const getStaffDashboard = asyncHandler(async (req, res) => {
  const facilityId = req.user.facilityId;

  if (req.user.role !== 'admin' && !facilityId) {
    throw new ApiError(403, 'Your staff profile is not assigned to any healthcare facility');
  }

  const facilityQuery = facilityId ? { facility: facilityId } : {};
  const referralQuery = facilityId
    ? { $or: [{ referringFacility: facilityId }, { receivingFacility: facilityId }] }
    : {};

  const [
    facility,
    totalRequests,
    pendingRequests,
    acceptedRequests,
    completedToday,
    incomingReferrals,
    outgoingReferrals,
    recentAppointments
  ] = await Promise.all([
    facilityId ? Facility.findById(facilityId) : null,
    Appointment.countDocuments(facilityQuery),
    Appointment.countDocuments({ ...facilityQuery, status: 'pending' }),
    Appointment.countDocuments({ ...facilityQuery, status: 'accepted' }),
    Appointment.countDocuments({ ...facilityQuery, status: 'completed' }),
    facilityId ? Referral.countDocuments({ receivingFacility: facilityId, status: { $ne: 'completed' } }) : 0,
    facilityId ? Referral.countDocuments({ referringFacility: facilityId }) : 0,
    Appointment.find(facilityQuery)
      .populate('patient', 'name phone email')
      .sort({ createdAt: -1 })
      .limit(5)
  ]);

  res.status(200).json({
    success: true,
    data: {
      facility,
      stats: {
        totalRequests,
        pendingRequests,
        acceptedRequests,
        completedToday,
        incomingReferrals,
        outgoingReferrals
      },
      recentAppointments
    }
  });
});

/**
 * @desc    Administrator governance & platform analytics
 * @route   GET /api/dashboard/admin
 * @access  Private (Admin)
 */
const getAdminDashboard = asyncHandler(async (req, res) => {
  const [
    totalFacilities,
    activeFacilities,
    totalUsers,
    totalPatients,
    totalStaff,
    totalAppointments,
    pendingAppointments,
    totalReferrals,
    activeReferrals,
    facilitiesByTier,
    appointmentsByStatus
  ] = await Promise.all([
    Facility.countDocuments(),
    Facility.countDocuments({ isActive: true }),
    User.countDocuments(),
    User.countDocuments({ role: 'patient' }),
    User.countDocuments({ role: { $in: ['staff', 'doctor', 'asha_worker'] } }),
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: 'pending' }),
    Referral.countDocuments(),
    Referral.countDocuments({ status: { $in: ['created', 'sent', 'accepted', 'in_progress'] } }),
    Facility.aggregate([
      { $group: { _id: '$facilityType', count: { $sum: 1 } } }
    ]),
    Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalFacilities,
        activeFacilities,
        totalUsers,
        totalPatients,
        totalStaff,
        totalAppointments,
        pendingAppointments,
        totalReferrals,
        activeReferrals
      },
      breakdowns: {
        facilitiesByTier: facilitiesByTier.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        appointmentsByStatus: appointmentsByStatus.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      }
    }
  });
});

module.exports = {
  getPatientDashboard,
  getStaffDashboard,
  getAdminDashboard
};
