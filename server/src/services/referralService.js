const Referral = require('../models/Referral');
const Facility = require('../models/Facility');
const User = require('../models/User');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const ApiError = require('../utils/ApiError');

const createReferral = async (data, user) => {
  // Confirm patient exists
  const patient = await User.findById(data.patient);
  if (!patient) {
    throw new ApiError(404, 'Referral target patient was not found');
  }

  // Confirm facilities exist and are active
  const [fromFacility, toFacility] = await Promise.all([
    Facility.findById(data.referringFacility),
    Facility.findById(data.receivingFacility)
  ]);

  if (!fromFacility || !fromFacility.isActive) {
    throw new ApiError(400, 'Originating healthcare facility is invalid or inactive');
  }
  if (!toFacility || !toFacility.isActive) {
    throw new ApiError(400, 'Target receiving healthcare facility is invalid or inactive');
  }
  if (fromFacility._id.toString() === toFacility._id.toString()) {
    throw new ApiError(400, 'Originating and destination healthcare facilities cannot be the same');
  }

  const referral = await Referral.create({
    patient: patient._id,
    referringFacility: fromFacility._id,
    receivingFacility: toFacility._id,
    referralReason: data.referralReason,
    provisionalDiagnosis: data.provisionalDiagnosis || '',
    urgencyLevel: data.urgencyLevel || 'Routine',
    vitals: data.vitals || {},
    status: 'created',
    createdBy: user.id
  });

  // Create patient notification
  await Notification.create({
    user: patient._id,
    title: 'Clinical Referral Initiated',
    message: `A referral from ${fromFacility.name} to ${toFacility.name} has been initiated for you. Reference #${referral.referralCode}.`,
    type: 'referral',
    relatedResource: { resourceType: 'Referral', resourceId: referral._id }
  });

  // Audit log
  await AuditLog.create({
    actor: user.id,
    action: 'REFERRAL_CREATED',
    resourceType: 'Referral',
    resourceId: referral._id,
    metadata: {
      referralCode: referral.referralCode,
      from: fromFacility._id,
      to: toFacility._id,
      urgency: referral.urgencyLevel
    }
  });

  return Referral.findById(referral._id)
    .populate('patient', 'name phone email preferredLanguage')
    .populate('referringFacility', 'name facilityType tier district taluka address')
    .populate('receivingFacility', 'name facilityType tier district taluka address contactInformation')
    .populate('createdBy', 'name role');
};

const getReferrals = async (user, filters = {}) => {
  const query = {};

  if (user.role === 'patient') {
    // Patient views ONLY their own referrals
    query.patient = user.id;
  } else if (user.role === 'staff' || user.role === 'doctor' || user.role === 'asha_worker') {
    if (!user.facilityId) {
      throw new ApiError(403, 'Your staff account is not assigned to any healthcare facility');
    }
    // Staff views referrals where their facility is either referring or receiving
    query.$or = [
      { referringFacility: user.facilityId },
      { receivingFacility: user.facilityId }
    ];
  } else if (user.role === 'admin') {
    if (filters.facility) {
      query.$or = [
        { referringFacility: filters.facility },
        { receivingFacility: filters.facility }
      ];
    }
    if (filters.patient) query.patient = filters.patient;
  } else {
    throw new ApiError(403, 'Access denied: Unauthorized role');
  }

  if (filters.status) {
    query.status = filters.status.toLowerCase();
  }

  return Referral.find(query)
    .populate('patient', 'name phone email preferredLanguage')
    .populate('referringFacility', 'name facilityType tier district taluka address')
    .populate('receivingFacility', 'name facilityType tier district taluka address contactInformation')
    .populate('createdBy', 'name role')
    .sort({ createdAt: -1 });
};

const getReferralById = async (id, user) => {
  const referral = await Referral.findById(id)
    .populate('patient', 'name phone email preferredLanguage')
    .populate('referringFacility', 'name facilityType tier district taluka address')
    .populate('receivingFacility', 'name facilityType tier district taluka address contactInformation')
    .populate('createdBy', 'name role');

  if (!referral) {
    throw new ApiError(404, 'Clinical referral record not found');
  }

  // Object-level authorization
  if (user.role === 'patient' && referral.patient._id.toString() !== user.id.toString()) {
    throw new ApiError(403, 'Access forbidden: You cannot view another patient\'s referral records');
  }

  if (
    (user.role === 'staff' || user.role === 'doctor') &&
    (!user.facilityId ||
      (referral.referringFacility._id.toString() !== user.facilityId.toString() &&
        referral.receivingFacility._id.toString() !== user.facilityId.toString()))
  ) {
    throw new ApiError(403, 'Access forbidden: You cannot access referrals for an unrelated facility');
  }

  return referral;
};

const updateReferralStatus = async (id, newStatus, note = '', user) => {
  const referral = await Referral.findById(id)
    .populate('referringFacility', 'name')
    .populate('receivingFacility', 'name');

  if (!referral) {
    throw new ApiError(404, 'Clinical referral record not found');
  }

  // Patients cannot update referral status
  if (user.role === 'patient') {
    throw new ApiError(403, 'Patients are not permitted to change referral status');
  }

  // Staff facility authorization
  if (user.role !== 'admin') {
    if (
      !user.facilityId ||
      (referral.referringFacility._id.toString() !== user.facilityId.toString() &&
        referral.receivingFacility._id.toString() !== user.facilityId.toString())
    ) {
      throw new ApiError(403, 'Access denied: You are not authorized to update referrals for this facility');
    }
  }

  // Terminal state check
  if (referral.status === 'completed' || referral.status === 'rejected') {
    throw new ApiError(
      400,
      `Cannot update a referral that is already finalized as '${referral.status}'`
    );
  }

  referral.status = newStatus;
  referral.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    actor: user.name || 'Medical Officer',
    actorId: user.id,
    note: note || `Referral status progressed to ${newStatus}`
  });

  await referral.save();

  // Create notification for patient
  await Notification.create({
    user: referral.patient,
    title: `Referral Status: ${newStatus.toUpperCase()}`,
    message: `Your referral #${referral.referralCode} from ${referral.referringFacility?.name} to ${referral.receivingFacility?.name} is now ${newStatus}.`,
    type: 'referral',
    relatedResource: { resourceType: 'Referral', resourceId: referral._id }
  });

  // Audit log
  await AuditLog.create({
    actor: user.id,
    action: 'REFERRAL_STATUS_UPDATED',
    resourceType: 'Referral',
    resourceId: referral._id,
    metadata: { newStatus, referralCode: referral.referralCode, note }
  });

  return referral;
};

module.exports = {
  createReferral,
  getReferrals,
  getReferralById,
  updateReferralStatus
};
