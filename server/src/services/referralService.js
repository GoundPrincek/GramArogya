/**
 * Clinical Referral Service
 * Orchestrates inter-facility referral state machines and transfers between rural health tiers.
 */
const Referral = require('../models/Referral');
const ApiError = require('../utils/ApiError');

const createReferral = async (referralData) => {
  const referral = await Referral.create(referralData);
  return Referral.findById(referral._id)
    .populate('patientId', 'name phone')
    .populate('fromFacilityId', 'name tier address')
    .populate('toFacilityId', 'name tier address contact')
    .populate('referringDoctorId', 'name');
};

const getMyReferrals = async (patientId) => {
  return Referral.find({ patientId })
    .populate('fromFacilityId', 'name tier address')
    .populate('toFacilityId', 'name tier address contact')
    .populate('referringDoctorId', 'name')
    .sort({ createdAt: -1 });
};

const getFacilityReferrals = async (facilityId, direction = 'incoming') => {
  const query = direction === 'incoming' 
    ? { toFacilityId: facilityId } 
    : { fromFacilityId: facilityId };

  return Referral.find(query)
    .populate('patientId', 'name phone')
    .populate('fromFacilityId', 'name tier')
    .populate('toFacilityId', 'name tier')
    .populate('referringDoctorId', 'name')
    .sort({ createdAt: -1 });
};

const triageReferral = async (id, status, receivingDoctorId, actionNotes) => {
  const referral = await Referral.findById(id);
  if (!referral) {
    throw new ApiError(404, 'Clinical referral record not found');
  }

  referral.status = status;
  if (receivingDoctorId) referral.receivingDoctorId = receivingDoctorId;
  if (actionNotes) referral.actionNotes = actionNotes;

  await referral.save();
  return referral;
};

module.exports = {
  createReferral,
  getMyReferrals,
  getFacilityReferrals,
  triageReferral
};
