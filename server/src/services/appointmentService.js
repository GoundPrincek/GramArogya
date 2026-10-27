/**
 * Appointment Service
 * Manages appointment booking, queue token generation, and schedule querying.
 */
const Appointment = require('../models/Appointment');
const ApiError = require('../utils/ApiError');

const bookAppointment = async (bookingData) => {
  // Generate incremental daily token for the facility
  const todayStart = new Date(bookingData.appointmentDate);
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(bookingData.appointmentDate);
  todayEnd.setHours(23, 59, 59, 999);

  const countToday = await Appointment.countDocuments({
    facilityId: bookingData.facilityId,
    appointmentDate: { $gte: todayStart, $lte: todayEnd }
  });

  const tokenNumber = countToday + 1;

  const appointment = await Appointment.create({
    ...bookingData,
    tokenNumber
  });

  return Appointment.findById(appointment._id)
    .populate('patientId', 'name phone')
    .populate('facilityId', 'name tier address contact');
};

const getMyAppointments = async (patientId) => {
  return Appointment.find({ patientId })
    .populate('facilityId', 'name tier address contact')
    .populate('doctorId', 'name')
    .sort({ appointmentDate: -1 });
};

const getFacilityAppointments = async (facilityId, date) => {
  const query = { facilityId };
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    query.appointmentDate = { $gte: start, $lte: end };
  }

  return Appointment.find(query)
    .populate('patientId', 'name phone')
    .populate('doctorId', 'name')
    .sort({ tokenNumber: 1 });
};

const updateAppointmentStatus = async (id, status, notes = '') => {
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new ApiError(404, 'Appointment not found');
  }

  appointment.status = status;
  if (notes) {
    appointment.consultationNotes = notes;
  }
  await appointment.save();

  return appointment;
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getFacilityAppointments,
  updateAppointmentStatus
};
