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

describe('User Management and Dashboards API', () => {
  before(async () => {
    await setupTestDB();
  });

  after(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it('GET /api/users/me returns authenticated user details', async () => {
    const { token } = await createTestUser({ name: 'Radha Shinde' });

    const res = await supertest(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.user.name, 'Radha Shinde');
  });

  it('PATCH /api/users/me allows updating profile but ignores/rejects role alteration', async () => {
    const { token } = await createTestUser({ role: 'patient', name: 'Original Name' });

    const res = await supertest(app)
      .patch('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated Name',
        preferredLanguage: 'mr',
        role: 'admin' // Attempted privilege escalation
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.user.name, 'Updated Name');
    assert.strictEqual(res.body.data.user.preferredLanguage, 'mr');
    // Must remain patient!
    assert.strictEqual(res.body.data.user.role, 'patient');
  });

  it('GET /api/users is protected for admin only', async () => {
    const patient = await createTestUser({ role: 'patient' });
    const admin = await createTestUser({ role: 'admin' });

    const forbiddenRes = await supertest(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${patient.token}`);
    assert.strictEqual(forbiddenRes.status, 403);

    const allowedRes = await supertest(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${admin.token}`);
    assert.strictEqual(allowedRes.status, 200);
    assert.strictEqual(allowedRes.body.success, true);
    assert.ok(Array.isArray(allowedRes.body.data));
  });

  it('Admin can promote a user role via PATCH /api/users/:id/role', async () => {
    const admin = await createTestUser({ role: 'admin' });
    const targetUser = await createTestUser({ role: 'patient' });
    const facility = await createTestFacility();

    const res = await supertest(app)
      .patch(`/api/users/${targetUser.user._id}/role`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({
        role: 'doctor',
        facilityId: facility._id.toString()
      });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.user.role, 'doctor');
  });

  it('Dashboard role-based access: Patient dashboard', async () => {
    const patient = await createTestUser({ role: 'patient' });

    const res = await supertest(app)
      .get('/api/dashboard/patient')
      .set('Authorization', `Bearer ${patient.token}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.stats !== undefined);
  });

  it('Dashboard role-based access: Staff dashboard rejects patient with 403', async () => {
    const patient = await createTestUser({ role: 'patient' });
    const facility = await createTestFacility();
    const staff = await createTestUser({ role: 'staff', facilityId: facility._id });

    const patientRes = await supertest(app)
      .get('/api/dashboard/staff')
      .set('Authorization', `Bearer ${patient.token}`);
    assert.strictEqual(patientRes.status, 403);

    const staffRes = await supertest(app)
      .get('/api/dashboard/staff')
      .set('Authorization', `Bearer ${staff.token}`);
    assert.strictEqual(staffRes.status, 200);
    assert.strictEqual(staffRes.body.success, true);
    assert.ok(staffRes.body.data.stats !== undefined);
  });

  it('Dashboard role-based access: Admin dashboard rejects patient and staff with 403', async () => {
    const patient = await createTestUser({ role: 'patient' });
    const facility = await createTestFacility();
    const staff = await createTestUser({ role: 'staff', facilityId: facility._id });
    const admin = await createTestUser({ role: 'admin' });

    const patientRes = await supertest(app)
      .get('/api/dashboard/admin')
      .set('Authorization', `Bearer ${patient.token}`);
    assert.strictEqual(patientRes.status, 403);

    const staffRes = await supertest(app)
      .get('/api/dashboard/admin')
      .set('Authorization', `Bearer ${staff.token}`);
    assert.strictEqual(staffRes.status, 403);

    const adminRes = await supertest(app)
      .get('/api/dashboard/admin')
      .set('Authorization', `Bearer ${admin.token}`);
    assert.strictEqual(adminRes.status, 200);
    assert.strictEqual(adminRes.body.success, true);
    assert.ok(adminRes.body.data.stats !== undefined);
  });
});
