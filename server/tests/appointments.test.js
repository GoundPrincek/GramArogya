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

describe('Appointments Management API', () => {
  before(async () => {
    await setupTestDB();
  });

  after(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it('POST /api/appointments creates a new appointment request for patient', async () => {
    const facility = await createTestFacility({ name: 'PHC Wagholi' });
    const { token, user } = await createTestUser({ role: 'patient' });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const res = await supertest(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${token}`)
      .send({
        facility: facility._id.toString(),
        requestedService: 'General OPD',
        preferredDate: dateStr,
        preferredTime: '10:00 AM',
        notes: 'Fever and cold for 2 days'
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.status, 'pending');
    assert.strictEqual(res.body.data.tokenNumber, 1);
    assert.strictEqual(res.body.data.patient._id, user._id.toString());
  });

  it('Patient data isolation: Patient A cannot view Patient B appointment', async () => {
    const facility = await createTestFacility();
    const patientA = await createTestUser({ role: 'patient', phone: '9822111111' });
    const patientB = await createTestUser({ role: 'patient', phone: '9822222222' });

    const dateStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    // Patient B books
    const bookRes = await supertest(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patientB.token}`)
      .send({
        facility: facility._id.toString(),
        requestedService: 'Maternal Health',
        preferredDate: dateStr,
        preferredTime: '11:00 AM'
      });
    const appointmentId = bookRes.body.data._id;

    // Patient A tries to view Patient B's appointment
    const viewRes = await supertest(app)
      .get(`/api/appointments/${appointmentId}`)
      .set('Authorization', `Bearer ${patientA.token}`);

    assert.strictEqual(viewRes.status, 403);
    assert.strictEqual(viewRes.body.success, false);
  });

  it('Patient data isolation: Patient A cannot cancel Patient B appointment', async () => {
    const facility = await createTestFacility();
    const patientA = await createTestUser({ role: 'patient', phone: '9822111111' });
    const patientB = await createTestUser({ role: 'patient', phone: '9822222222' });

    const dateStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    // Patient B books
    const bookRes = await supertest(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patientB.token}`)
      .send({
        facility: facility._id.toString(),
        requestedService: 'General OPD',
        preferredDate: dateStr,
        preferredTime: '09:30 AM'
      });
    const appointmentId = bookRes.body.data._id;

    // Patient A tries to cancel
    const cancelRes = await supertest(app)
      .patch(`/api/appointments/${appointmentId}/cancel`)
      .set('Authorization', `Bearer ${patientA.token}`)
      .send({ reason: 'Malicious cancellation' });

    assert.strictEqual(cancelRes.status, 403);
    assert.strictEqual(cancelRes.body.success, false);
  });

  it('Patient can cancel their own pending appointment', async () => {
    const facility = await createTestFacility();
    const patient = await createTestUser({ role: 'patient' });
    const dateStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const bookRes = await supertest(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patient.token}`)
      .send({
        facility: facility._id.toString(),
        requestedService: 'General OPD',
        preferredDate: dateStr,
        preferredTime: '10:00 AM'
      });

    const cancelRes = await supertest(app)
      .patch(`/api/appointments/${bookRes.body.data._id}/cancel`)
      .set('Authorization', `Bearer ${patient.token}`)
      .send({ reason: 'Feeling better' });

    assert.strictEqual(cancelRes.status, 200);
    assert.strictEqual(cancelRes.body.success, true);
    assert.strictEqual(cancelRes.body.data.status, 'cancelled');
    assert.strictEqual(cancelRes.body.data.decisionReason, 'Feeling better');
  });

  it('Staff of facility can accept an appointment', async () => {
    const facility = await createTestFacility();
    const patient = await createTestUser({ role: 'patient' });
    const staff = await createTestUser({ role: 'staff', facilityId: facility._id });

    const dateStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const bookRes = await supertest(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patient.token}`)
      .send({
        facility: facility._id.toString(),
        requestedService: 'Immunization',
        preferredDate: dateStr,
        preferredTime: '11:00 AM'
      });

    const acceptRes = await supertest(app)
      .patch(`/api/appointments/${bookRes.body.data._id}/accept`)
      .set('Authorization', `Bearer ${staff.token}`);

    assert.strictEqual(acceptRes.status, 200);
    assert.strictEqual(acceptRes.body.success, true);
    assert.strictEqual(acceptRes.body.data.status, 'accepted');
  });

  it('Staff isolation: Staff of Facility A cannot accept appointment for Facility B', async () => {
    const facilityA = await createTestFacility({ name: 'Facility A' });
    const facilityB = await createTestFacility({ name: 'Facility B' });

    const patient = await createTestUser({ role: 'patient' });
    const staffA = await createTestUser({ role: 'staff', facilityId: facilityA._id });

    const dateStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    // Booked at Facility B
    const bookRes = await supertest(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patient.token}`)
      .send({
        facility: facilityB._id.toString(),
        requestedService: 'General OPD',
        preferredDate: dateStr,
        preferredTime: '12:00 PM'
      });

    // Staff of Facility A tries to accept Facility B appointment
    const acceptRes = await supertest(app)
      .patch(`/api/appointments/${bookRes.body.data._id}/accept`)
      .set('Authorization', `Bearer ${staffA.token}`);

    assert.strictEqual(acceptRes.status, 403);
    assert.strictEqual(acceptRes.body.success, false);
  });

  it('Staff rejecting appointment requires a clear decision reason', async () => {
    const facility = await createTestFacility();
    const patient = await createTestUser({ role: 'patient' });
    const staff = await createTestUser({ role: 'staff', facilityId: facility._id });

    const dateStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const bookRes = await supertest(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patient.token}`)
      .send({
        facility: facility._id.toString(),
        requestedService: 'Dental OPD',
        preferredDate: dateStr,
        preferredTime: '02:00 PM'
      });

    // Rejection without reason fails with 400
    const failRes = await supertest(app)
      .patch(`/api/appointments/${bookRes.body.data._id}/reject`)
      .set('Authorization', `Bearer ${staff.token}`)
      .send({});

    assert.strictEqual(failRes.status, 400);

    // Rejection with reason succeeds
    const rejectRes = await supertest(app)
      .patch(`/api/appointments/${bookRes.body.data._id}/reject`)
      .set('Authorization', `Bearer ${staff.token}`)
      .send({ decisionReason: 'Doctor on emergency duty at another center' });

    assert.strictEqual(rejectRes.status, 200);
    assert.strictEqual(rejectRes.body.success, true);
    assert.strictEqual(rejectRes.body.data.status, 'rejected');
    assert.strictEqual(rejectRes.body.data.decisionReason, 'Doctor on emergency duty at another center');
  });

  it('Staff can mark accepted appointment as completed', async () => {
    const facility = await createTestFacility();
    const patient = await createTestUser({ role: 'patient' });
    const staff = await createTestUser({ role: 'staff', facilityId: facility._id });

    const dateStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const bookRes = await supertest(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${patient.token}`)
      .send({
        facility: facility._id.toString(),
        requestedService: 'Eye Checkup',
        preferredDate: dateStr,
        preferredTime: '10:30 AM'
      });

    await supertest(app)
      .patch(`/api/appointments/${bookRes.body.data._id}/accept`)
      .set('Authorization', `Bearer ${staff.token}`);

    const completeRes = await supertest(app)
      .patch(`/api/appointments/${bookRes.body.data._id}/complete`)
      .set('Authorization', `Bearer ${staff.token}`)
      .send({ consultationNotes: 'Vision 6/6, prescribed eye drops.' });

    assert.strictEqual(completeRes.status, 200);
    assert.strictEqual(completeRes.body.success, true);
    assert.strictEqual(completeRes.body.data.status, 'completed');
    assert.strictEqual(completeRes.body.data.consultationNotes, 'Vision 6/6, prescribed eye drops.');
  });
});
