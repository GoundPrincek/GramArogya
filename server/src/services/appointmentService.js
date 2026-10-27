const Appointment = require('../models/Appointment');
const Facility = require('../models/Facility');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const ApiError = require('../utils/ApiError');

const bookAppointment = async (data, user) => {
  // 1. Confirm facility exists and is active
  const facility = await Facility.findById(data.facility);
  if (!facility) {
    throw new ApiError(404, 'Selected healthcare facility was not found');
  }
  if (!facility.isActive) {
    throw new ApiError(400, 'Selected healthcare facility is currently inactive and cannot accept appointments');
  }

  // 2. Validate preferred date is not in the past
  const apptDate = new Date(data.preferredDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (isNaN(apptDate.getTime())) {
    throw new ApiError(400, 'Invalid preferred appointment date');
  }

  // 3. Increment token number for the day
  const startOfDay = new Date(apptDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(apptDate);
  endOfDay.setHours(23, 59, 59, 999);

  const countToday = await Appointment.countDocuments({
    facility: facility._id,
    preferredDate: { $gte: startOfDay, $lte: endOfDay }
  });

  const tokenNumber = countToday + 1;

  // 4. Save appointment
  const appointment = await Appointment.create({
    patient: user.id,
    facility: facility._id,
    requestedService: data.requestedService,
    preferredDate: apptDate,
    preferredTime: data.preferredTime,
    notes: data.notes || '',
    tokenNumber,
    status: 'pending'
  });

  // 5. Create in-app notification for patient
  await Notification.create({
    user: user.id,
    title: 'Appointment Request Submitted',
    message: `Your request for ${data.requestedService} at ${facility.name} on ${apptDate.toLocaleDateString('en-IN')} has been submitted (Token #${tokenNumber}). Pending review by facility staff.`,
    type: 'appointment',
    relatedResource: {
      resourceType: 'Appointment',
      resourceId: appointment._id
    }
  });

  // 6. Audit log
  await AuditLog.create({
    actor: user.id,
    action: 'APPOINTMENT_REQUESTED',
    resourceType: 'Appointment',
    resourceId: appointment._id,
    metadata: { facilityId: facility._id, tokenNumber }
  });

  return Appointment.findById(appointment._id)
    .populate('patient', 'name phone email preferredLanguage')
    .populate('facility', 'name facilityType tier district taluka village address contactInformation');
};

const getAppointments = async (user, filters = {}) => {
  const query = {};

  if (user.role === 'patient') {
    // Patient can view ONLY their own requests
    query.patient = user.id;
  } else if (user.role === 'staff' || user.role === 'doctor' || user.role === 'asha_worker') {
    // Staff can view requests ONLY for their assigned facility
    if (!user.facilityId) {
      throw new ApiError(403, 'Your staff account is not assigned to any healthcare facility');
    }
    query.facility = user.facilityId;
  } else if (user.role === 'admin') {
    // Admin can view all or filter by facility/patient
    if (filters.facility) query.facility = filters.facility;
    if (filters.patient) query.patient = filters.patient;
  } else {
    throw new ApiError(403, 'Access denied: Unauthorized role');
  }

  if (filters.status) {
    query.status = filters.status.toLowerCase();
  }

  return Appointment.find(query)
    .populate('patient', 'name phone email preferredLanguage')
    .populate('facility', 'name facilityType tier district taluka village address contactInformation')
    .populate('reviewedBy', 'name role')
    .sort({ preferredDate: -1, createdAt: -1 });
};

const getAppointmentById = async (id, user) => {
  const appointment = await Appointment.findById(id)
    .populate('patient', 'name phone email preferredLanguage')
    .populate('facility', 'name facilityType tier district taluka village address contactInformation')
    .populate('reviewedBy', 'name role');

  if (!appointment) {
    throw new ApiError(404, 'Appointment record not found');
  }

  // Object-level authorization
  if (user.role === 'patient' && appointment.patient._id.toString() !== user.id.toString()) {
    throw new ApiError(403, 'Access forbidden: You cannot view another patient\'s appointment record');
  }

  if (
    (user.role === 'staff' || user.role === 'doctor') &&
    (!user.facilityId || appointment.facility._id.toString() !== user.facilityId.toString())
  ) {
    throw new ApiError(403, 'Access forbidden: You cannot access appointments for an unrelated facility');
  }

  return appointment;
};

const cancelAppointment = async (id, reason = '', user) => {
  const appointment = await Appointment.findById(id).populate('facility', 'name');
  if (!appointment) {
    throw new ApiError(404, 'Appointment record not found');
  }

  // Patient can cancel only their own appointment
  if (user.role === 'patient' && appointment.patient.toString() !== user.id.toString()) {
    throw new ApiError(403, 'Access forbidden: You can only cancel your own appointments');
  }

  // Validate status transition: Can cancel only if pending or accepted
  if (appointment.status !== 'pending' && appointment.status !== 'accepted') {
    throw new ApiError(
      400,
      `Cannot cancel an appointment that is already ${appointment.status}`
    );
  }

  appointment.status = 'cancelled';
  appointment.decisionReason = reason || 'Cancelled by user';
  await appointment.save();

  // Create notification
  await Notification.create({
    user: appointment.patient,
    title: 'Appointment Request Cancelled',
    message: `Your appointment request at ${appointment.facility?.name || 'the facility'} has been cancelled.`,
    type: 'appointment',
    relatedResource: { resourceType: 'Appointment', resourceId: appointment._id }
  });

  // Audit log
  await AuditLog.create({
    actor: user.id,
    action: 'APPOINTMENT_CANCELLED',
    resourceType: 'Appointment',
    resourceId: appointment._id,
    metadata: { reason: appointment.decisionReason }
  });

  return appointment;
};

const acceptAppointment = async (id, user) => {
  const appointment = await Appointment.findById(id).populate('facility', 'name');
  if (!appointment) {
    throw new ApiError(404, 'Appointment record not found');
  }

  // Verify staff authorization for this facility
  if (user.role !== 'admin') {
    if (!user.facilityId || appointment.facility._id.toString() !== user.facilityId.toString()) {
      throw new ApiError(403, 'Access denied: You are not authorized to manage appointments for this facility');
    }
  }

  // Validate current status: Only pending can be accepted
  if (appointment.status !== 'pending') {
    throw new ApiError(
      400,
      `Invalid status transition: Only 'pending' appointments can be accepted (current: '${appointment.status}')`
    );
  }

  appointment.status = 'accepted';
  appointment.reviewedBy = user.id;
  await appointment.save();

  // Create notification for patient
  await Notification.create({
    user: appointment.patient,
    title: 'Appointment Request Accepted',
    message: `Your appointment request for ${appointment.requestedService} at ${appointment.facility?.name} has been confirmed. Token #${appointment.tokenNumber}.`,
    type: 'appointment',
    relatedResource: { resourceType: 'Appointment', resourceId: appointment._id }
  });

  // Audit log
  await AuditLog.create({
    actor: user.id,
    action: 'APPOINTMENT_ACCEPTED',
    resourceType: 'Appointment',
    resourceId: appointment._id,
    metadata: { reviewedBy: user.id, tokenNumber: appointment.tokenNumber }
  });

  return appointment;
};

const rejectAppointment = async (id, decisionReason, user) => {
  const appointment = await Appointment.findById(id).populate('facility', 'name');
  if (!appointment) {
    throw new ApiError(404, 'Appointment record not found');
  }

  // Verify staff authorization for this facility
  if (user.role !== 'admin') {
    if (!user.facilityId || appointment.facility._id.toString() !== user.facilityId.toString()) {
      throw new ApiError(403, 'Access denied: You are not authorized to manage appointments for this facility');
    }
  }

  // Validate status transition: Only pending can be rejected
  if (appointment.status !== 'pending') {
    throw new ApiError(
      400,
      `Invalid status transition: Only 'pending' appointments can be rejected (current: '${appointment.status}')`
    );
  }

  appointment.status = 'rejected';
  appointment.decisionReason = decisionReason || 'Consultation slot unavailable at facility';
  appointment.reviewedBy = user.id;
  await appointment.save();

  // Create notification for patient
  await Notification.create({
    user: appointment.patient,
    title: 'Appointment Request Not Accepted',
    message: `Your appointment request at ${appointment.facility?.name} could not be scheduled. Reason: ${appointment.decisionReason}`,
    type: 'appointment',
    relatedResource: { resourceType: 'Appointment', resourceId: appointment._id }
  });

  // Audit log
  await AuditLog.create({
    actor: user.id,
    action: 'APPOINTMENT_REJECTED',
    resourceType: 'Appointment',
    resourceId: appointment._id,
    metadata: { reviewedBy: user.id, reason: appointment.decisionReason }
  });

  return appointment;
};

const completeAppointment = async (id, consultationNotes = '', user) => {
  const appointment = await Appointment.findById(id).populate('facility', 'name');
  if (!appointment) {
    throw new ApiError(404, 'Appointment record not found');
  }

  // Staff / admin authorization check
  if (user.role !== 'admin') {
    if (!user.facilityId || appointment.facility._id.toString() !== user.facilityId.toString()) {
      throw new ApiError(403, 'Access denied: You are not authorized for this facility');
    }
  }

  // Only accepted appointments can be marked completed
  if (appointment.status !== 'accepted') {
    throw new ApiError(
      400,
      `Cannot complete an appointment that has not been accepted (current status: '${appointment.status}')`
    );
  }

  appointment.status = 'completed';
  if (consultationNotes) {
    appointment.consultationNotes = consultationNotes;
  }
  await appointment.save();

  // Audit log
  await AuditLog.create({
    actor: user.id,
    action: 'APPOINTMENT_COMPLETED',
    resourceType: 'Appointment',
    resourceId: appointment._id,
    metadata: { reviewedBy: user.id }
  });

  return appointment;
};

module.exports = {
  bookAppointment,
  getAppointments,
  getAppointmentById,
  cancelAppointment,
  acceptAppointment,
  rejectAppointment,
  completeAppointment
};
