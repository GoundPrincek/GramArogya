const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../src/app');
const {
  setupTestDB,
  teardownTestDB,
  clearTestDB,
  createTestUser,
  createTestFacility
} = require('./testHelper');

describe('Clinical Referrals API', () => {
  before(async () => {
    await setupTestDB();
  });

  after(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it('Patient cannot create a clinical referral (requires staff or admin role)', async () => {
    const fromFacility = await createTestFacility({ name: 'PHC A' });
    const toFacility = await createTestFacility({ name: 'District Hospital B' });
    const patient = await createTestUser({ role: 'patient' });

    const res = await supertest(app)
      .post('/api/referrals')
      .set('Authorization', `Bearer ${patient.token}`)
      .send({
        patient: patient.user._id.toString(),
        referringFacility: fromFacility._id.toString(),
        receivingFacility: toFacility._id.toString(),
        referralReason: 'Specialized cardiology care needed'
      });

    assert.strictEqual(res.status, 403);
  });

  it('Staff creates a clinical referral with auto-generated code and statusHistory', async () => {
    const fromFacility = await createTestFacility({ name: 'PHC A' });
    const toFacility = await createTestFacility({ name: 'District Hospital B' });
    const patient = await createTestUser({ role: 'patient' });
    const staff = await createTestUser({ role: 'doctor', facilityId: fromFacility._id });

    const res = await supertest(app)
      .post('/api/referrals')
      .set('Authorization', `Bearer ${staff.token}`)
      .send({
        patient: patient.user._id.toString(),
        referringFacility: fromFacility._id.toString(),
        receivingFacility: toFacility._id.toString(),
        referralReason: 'Persistent severe chest pain, ECG abnormal',
        urgencyLevel: 'Urgent'
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'created');
    assert.ok(res.body.data.referralCode.startsWith('REF-'));
    assert.strictEqual(res.body.data.statusHistory.length, 1);
    assert.strictEqual(res.body.data.statusHistory[0].status, 'created');
  });

  it('Referral status transition: created -> sent -> accepted -> in_progress -> completed', async () => {
    const fromFacility = await createTestFacility({ name: 'PHC A' });
    const toFacility = await createTestFacility({ name: 'District Hospital B' });
    const patient = await createTestUser({ role: 'patient' });
    const staffA = await createTestUser({ role: 'doctor', facilityId: fromFacility._id });
    const staffB = await createTestUser({ role: 'staff', facilityId: toFacility._id });

    // 1. Create
    const createRes = await supertest(app)
      .post('/api/referrals')
      .set('Authorization', `Bearer ${staffA.token}`)
      .send({
        patient: patient.user._id.toString(),
        referringFacility: fromFacility._id.toString(),
        receivingFacility: toFacility._id.toString(),
        referralReason: 'High risk obstetrics referral'
      });
    const referralId = createRes.body.data._id;

    // 2. Transition: sent
    const sentRes = await supertest(app)
      .patch(`/api/referrals/${referralId}/status`)
      .set('Authorization', `Bearer ${staffA.token}`)
      .send({ status: 'sent', note: 'Dispatched via 108 ambulance' });
    assert.strictEqual(sentRes.status, 200);
    assert.strictEqual(sentRes.body.data.status, 'sent');

    // 3. Transition: accepted by receiving facility
    const acceptRes = await supertest(app)
      .patch(`/api/referrals/${referralId}/status`)
      .set('Authorization', `Bearer ${staffB.token}`)
      .send({ status: 'accepted', note: 'Bed reserved in emergency triage' });
    assert.strictEqual(acceptRes.status, 200);
    assert.strictEqual(acceptRes.body.data.status, 'accepted');

    // 4. Transition: in_progress
    const inProgRes = await supertest(app)
      .patch(`/api/referrals/${referralId}/status`)
      .set('Authorization', `Bearer ${staffB.token}`)
      .send({ status: 'in_progress', note: 'Consultation underway' });
    assert.strictEqual(inProgRes.status, 200);
    assert.strictEqual(inProgRes.body.data.status, 'in_progress');

    // 5. Transition: completed
    const completeRes = await supertest(app)
      .patch(`/api/referrals/${referralId}/status`)
      .set('Authorization', `Bearer ${staffB.token}`)
      .send({ status: 'completed', note: 'Successfully delivered, patient stable' });
    assert.strictEqual(completeRes.status, 200);
    assert.strictEqual(completeRes.body.data.status, 'completed');
    assert.strictEqual(completeRes.body.data.statusHistory.length, 5);

    // 6. Cannot update a completed referral (terminal state)
    const failRes = await supertest(app)
      .patch(`/api/referrals/${referralId}/status`)
      .set('Authorization', `Bearer ${staffB.token}`)
      .send({ status: 'sent' });
    assert.strictEqual(failRes.status, 400);
  });

  it('Patient cannot change referral status', async () => {
    const fromFacility = await createTestFacility({ name: 'PHC A' });
    const toFacility = await createTestFacility({ name: 'District Hospital B' });
    const patient = await createTestUser({ role: 'patient' });
    const doctor = await createTestUser({ role: 'doctor', facilityId: fromFacility._id });

    const createRes = await supertest(app)
      .post('/api/referrals')
      .set('Authorization', `Bearer ${doctor.token}`)
      .send({
        patient: patient.user._id.toString(),
        referringFacility: fromFacility._id.toString(),
        receivingFacility: toFacility._id.toString(),
        referralReason: 'Fracture management'
      });

    const res = await supertest(app)
      .patch(`/api/referrals/${createRes.body.data._id}/status`)
      .set('Authorization', `Bearer ${patient.token}`)
      .send({ status: 'completed' });

    assert.strictEqual(res.status, 403);
  });

  it('Patient isolation: Patient A cannot view Patient B referral record', async () => {
    const fromFacility = await createTestFacility({ name: 'PHC A' });
    const toFacility = await createTestFacility({ name: 'District Hospital B' });
    const patientA = await createTestUser({ role: 'patient', phone: '9822111111' });
    const patientB = await createTestUser({ role: 'patient', phone: '9822222222' });
    const doctor = await createTestUser({ role: 'doctor', facilityId: fromFacility._id });

    const createRes = await supertest(app)
      .post('/api/referrals')
      .set('Authorization', `Bearer ${doctor.token}`)
      .send({
        patient: patientB.user._id.toString(),
        referringFacility: fromFacility._id.toString(),
        receivingFacility: toFacility._id.toString(),
        referralReason: 'Routine referral'
      });

    const viewRes = await supertest(app)
      .get(`/api/referrals/${createRes.body.data._id}`)
      .set('Authorization', `Bearer ${patientA.token}`);

    assert.strictEqual(viewRes.status, 403);
  });
});
