const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../src/app');
const Notification = require('../src/models/Notification');
const {
  setupTestDB,
  teardownTestDB,
  clearTestDB,
  createTestUser,
  createTestFacility
} = require('./testHelper');

describe('GramArogya Connect — Complete API Test Suite', () => {
  before(async () => {
    await setupTestDB();
  });

  after(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  /* =========================================================================
     1. HEALTH CHECK & SYSTEM INTEGRITY
     ========================================================================= */
  describe('1. Health Check Endpoint', () => {
    it('GET /api/health returns operational status and accurate DB connection', async () => {
      const res = await supertest(app).get('/api/health');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.status, 'healthy');
      assert.strictEqual(res.body.data.service, 'GramArogyaConnect-Backend');
      assert.strictEqual(res.body.data.database.connected, true);
      assert.strictEqual(res.body.data.database.state, 'connected');
    });

    it('GET /api/unknown-route returns 404', async () => {
      const res = await supertest(app).get('/api/unknown-nonexistent-route');
      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.body.success, false);
    });
  });

  /* =========================================================================
     2. AUTHENTICATION & ROLE-BASED ACCESS
     ========================================================================= */
  describe('2. Authentication & Authorization', () => {
    it('POST /api/auth/register creates a new patient account', async () => {
      const res = await supertest(app).post('/api/auth/register').send({
        name: 'Ramesh Patil',
        phone: '9822123456',
        email: 'ramesh.patil@example.com',
        password: 'password123',
        preferredLanguage: 'mr'
      });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.user.name, 'Ramesh Patil');
      assert.strictEqual(res.body.data.user.phone, '9822123456');
      assert.strictEqual(res.body.data.user.role, 'patient');
      assert.strictEqual(res.body.data.user.passwordHash, undefined);
      assert.ok(res.body.data.token);
    });

    it('POST /api/auth/register enforces patient role even if client passes role="admin"', async () => {
      const res = await supertest(app).post('/api/auth/register').send({
        name: 'Sneaky Attacker',
        phone: '9822999999',
        password: 'secretPassword123',
        role: 'admin'
      });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.data.user.role, 'patient');
    });

    it('POST /api/auth/register rejects invalid inputs', async () => {
      const res = await supertest(app).post('/api/auth/register').send({
        name: 'A',
        phone: '1234',
        password: '123'
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
      assert.ok(Array.isArray(res.body.errors));
    });

    it('POST /api/auth/register prevents duplicate phone registration', async () => {
      await createTestUser({ phone: '9822000001' });

      const res = await supertest(app).post('/api/auth/register').send({
        name: 'Duplicate Ramesh',
        phone: '9822000001',
        password: 'password123'
      });

      assert.strictEqual(res.status, 409);
      assert.strictEqual(res.body.success, false);
    });

    it('POST /api/auth/login authenticates valid phone and password', async () => {
      await createTestUser({
        name: 'Sunita Gaikwad',
        phone: '9822112233',
        password: 'mypassword123'
      });

      const res = await supertest(app).post('/api/auth/login').send({
        identifier: '9822112233',
        password: 'mypassword123'
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.data.token);
      assert.strictEqual(res.body.data.user.phone, '9822112233');
    });

    it('POST /api/auth/login rejects incorrect password with 401', async () => {
      await createTestUser({ phone: '9822112233', password: 'correctPassword' });

      const res = await supertest(app).post('/api/auth/login').send({
        identifier: '9822112233',
        password: 'wrongPassword'
      });

      assert.strictEqual(res.status, 401);
    });

    it('GET /api/auth/me returns current user profile when authenticated', async () => {
      const { token, user } = await createTestUser({ name: 'Me User', phone: '9822555555' });

      const res = await supertest(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.user._id, user._id.toString());
    });

    it('GET /api/auth/me rejects unauthenticated request with 401', async () => {
      const res = await supertest(app).get('/api/auth/me');
      assert.strictEqual(res.status, 401);
    });
  });

  /* =========================================================================
     3. HEALTHCARE FACILITIES
     ========================================================================= */
  describe('3. Healthcare Facilities Management', () => {
    it('GET /api/facilities returns paginated facility listing', async () => {
      await createTestFacility({ name: 'PHC Wagholi', district: 'Pune', facilityType: 'PHC' });
      await createTestFacility({ name: 'RH Baramati', district: 'Pune', facilityType: 'CHC' });

      const res = await supertest(app).get('/api/facilities?page=1&limit=10');

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.length, 2);
      assert.strictEqual(res.body.total, 2);
    });

    it('GET /api/facilities filters by district and facility type', async () => {
      await createTestFacility({ name: 'PHC Wagholi', district: 'Pune', facilityType: 'PHC' });
      await createTestFacility({ name: 'District Hospital Satara', district: 'Satara', facilityType: 'DistrictHospital' });

      const puneRes = await supertest(app).get('/api/facilities?district=Pune');
      assert.strictEqual(puneRes.status, 200);
      assert.strictEqual(puneRes.body.data.length, 1);
      assert.strictEqual(puneRes.body.data[0].district, 'Pune');

      const phcRes = await supertest(app).get('/api/facilities?type=PHC');
      assert.strictEqual(phcRes.status, 200);
      assert.strictEqual(phcRes.body.data.length, 1);
      assert.strictEqual(phcRes.body.data[0].facilityType, 'PHC');
    });

    it('GET /api/facilities/:id returns a single facility and 404 for unknown', async () => {
      const facility = await createTestFacility({ name: 'Specific PHC' });

      const res = await supertest(app).get(`/api/facilities/${facility._id}`);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.name, 'Specific PHC');

      const unknownRes = await supertest(app).get('/api/facilities/507f1f77bcf86cd799439011');
      assert.strictEqual(unknownRes.status, 404);
    });

    it('POST /api/facilities enforces admin-only authorization', async () => {
      const patient = await createTestUser({ role: 'patient' });
      const admin = await createTestUser({ role: 'admin' });

      // Patient cannot create
      const patientRes = await supertest(app)
        .post('/api/facilities')
        .set('Authorization', `Bearer ${patient.token}`)
        .send({ name: 'Hospital X', facilityType: 'PHC', district: 'Pune' });
      assert.strictEqual(patientRes.status, 403);

      // Admin can create
      const adminRes = await supertest(app)
        .post('/api/facilities')
        .set('Authorization', `Bearer ${admin.token}`)
        .send({
          name: 'New Admin Hospital',
          facilityType: 'SubDistrictHospital',
          district: 'Nashik',
          taluka: 'Dindori',
          village: 'Dindori'
        });
      assert.strictEqual(adminRes.status, 201);
      assert.strictEqual(adminRes.body.data.name, 'New Admin Hospital');
    });
  });

  /* =========================================================================
     4. APPOINTMENTS LIFECYCLE & ISOLATION
     ========================================================================= */
  describe('4. Appointments Lifecycle & Access Isolation', () => {
    it('Patient creates appointment request with token #1', async () => {
      const facility = await createTestFacility({ name: 'PHC Wagholi' });
      const { token, user } = await createTestUser({ role: 'patient' });

      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

      const res = await supertest(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          facility: facility._id.toString(),
          requestedService: 'General OPD',
          preferredDate: tomorrow,
          preferredTime: '10:00 AM'
        });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.data.status, 'pending');
      assert.strictEqual(res.body.data.tokenNumber, 1);
      assert.strictEqual(res.body.data.patient._id, user._id.toString());
    });

    it('Patient data isolation: Patient A cannot view or cancel Patient B appointment', async () => {
      const facility = await createTestFacility();
      const patientA = await createTestUser({ role: 'patient', phone: '9822111111' });
      const patientB = await createTestUser({ role: 'patient', phone: '9822222222' });
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

      // Book for B
      const bookRes = await supertest(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${patientB.token}`)
        .send({
          facility: facility._id.toString(),
          requestedService: 'General OPD',
          preferredDate: tomorrow,
          preferredTime: '11:00 AM'
        });
      const appointmentId = bookRes.body.data._id;

      // Patient A tries to view
      const viewRes = await supertest(app)
        .get(`/api/appointments/${appointmentId}`)
        .set('Authorization', `Bearer ${patientA.token}`);
      assert.strictEqual(viewRes.status, 403);

      // Patient A tries to cancel
      const cancelRes = await supertest(app)
        .patch(`/api/appointments/${appointmentId}/cancel`)
        .set('Authorization', `Bearer ${patientA.token}`);
      assert.strictEqual(cancelRes.status, 403);
    });

    it('Patient can cancel own appointment', async () => {
      const facility = await createTestFacility();
      const patient = await createTestUser({ role: 'patient' });
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

      const bookRes = await supertest(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${patient.token}`)
        .send({
          facility: facility._id.toString(),
          requestedService: 'General OPD',
          preferredDate: tomorrow,
          preferredTime: '10:00 AM'
        });

      const cancelRes = await supertest(app)
        .patch(`/api/appointments/${bookRes.body.data._id}/cancel`)
        .set('Authorization', `Bearer ${patient.token}`)
        .send({ reason: 'Feeling better' });

      assert.strictEqual(cancelRes.status, 200);
      assert.strictEqual(cancelRes.body.data.status, 'cancelled');
    });

    it('Staff can accept appointment, rejecting requires clear reason, staff isolation enforced', async () => {
      const facilityA = await createTestFacility({ name: 'PHC A' });
      const facilityB = await createTestFacility({ name: 'PHC B' });
      const patient = await createTestUser({ role: 'patient' });
      const staffA = await createTestUser({ role: 'staff', facilityId: facilityA._id });
      const staffB = await createTestUser({ role: 'staff', facilityId: facilityB._id });
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

      // Booked at Facility A
      const bookRes = await supertest(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${patient.token}`)
        .send({
          facility: facilityA._id.toString(),
          requestedService: 'Immunization',
          preferredDate: tomorrow,
          preferredTime: '10:00 AM'
        });
      const appointmentId = bookRes.body.data._id;

      // Staff of Facility B cannot accept appointment for Facility A
      const wrongStaffRes = await supertest(app)
        .patch(`/api/appointments/${appointmentId}/accept`)
        .set('Authorization', `Bearer ${staffB.token}`);
      assert.strictEqual(wrongStaffRes.status, 403);

      // Staff A rejects without reason -> fails with 400
      const noReasonRes = await supertest(app)
        .patch(`/api/appointments/${appointmentId}/reject`)
        .set('Authorization', `Bearer ${staffA.token}`)
        .send({});
      assert.strictEqual(noReasonRes.status, 400);

      // Staff A accepts
      const acceptRes = await supertest(app)
        .patch(`/api/appointments/${appointmentId}/accept`)
        .set('Authorization', `Bearer ${staffA.token}`);
      assert.strictEqual(acceptRes.status, 200);
      assert.strictEqual(acceptRes.body.data.status, 'accepted');

      // Staff A completes
      const completeRes = await supertest(app)
        .patch(`/api/appointments/${appointmentId}/complete`)
        .set('Authorization', `Bearer ${staffA.token}`)
        .send({ consultationNotes: 'Administered vaccine successfully' });
      assert.strictEqual(completeRes.status, 200);
      assert.strictEqual(completeRes.body.data.status, 'completed');
    });
  });

  /* =========================================================================
     5. CLINICAL REFERRALS & STATUS TRANSITIONS
     ========================================================================= */
  describe('5. Clinical Referrals State Machine', () => {
    it('Patient cannot initiate clinical referrals', async () => {
      const fromFac = await createTestFacility();
      const toFac = await createTestFacility();
      const patient = await createTestUser({ role: 'patient' });

      const res = await supertest(app)
        .post('/api/referrals')
        .set('Authorization', `Bearer ${patient.token}`)
        .send({
          patient: patient.user._id.toString(),
          referringFacility: fromFac._id.toString(),
          receivingFacility: toFac._id.toString(),
          referralReason: 'Surgery needed'
        });

      assert.strictEqual(res.status, 403);
    });

    it('Staff creates referral with statusHistory and transitions state', async () => {
      const fromFac = await createTestFacility();
      const toFac = await createTestFacility();
      const patient = await createTestUser({ role: 'patient' });
      const staffA = await createTestUser({ role: 'doctor', facilityId: fromFac._id });
      const staffB = await createTestUser({ role: 'staff', facilityId: toFac._id });

      // Create
      const createRes = await supertest(app)
        .post('/api/referrals')
        .set('Authorization', `Bearer ${staffA.token}`)
        .send({
          patient: patient.user._id.toString(),
          referringFacility: fromFac._id.toString(),
          receivingFacility: toFac._id.toString(),
          referralReason: 'Cardiology specialist evaluation',
          urgencyLevel: 'Urgent'
        });
      assert.strictEqual(createRes.status, 201);
      assert.strictEqual(createRes.body.data.status, 'created');
      assert.ok(createRes.body.data.referralCode.startsWith('REF-'));
      const referralId = createRes.body.data._id;

      // Status: sent
      const sentRes = await supertest(app)
        .patch(`/api/referrals/${referralId}/status`)
        .set('Authorization', `Bearer ${staffA.token}`)
        .send({ status: 'sent', note: 'Patient in transit' });
      assert.strictEqual(sentRes.status, 200);
      assert.strictEqual(sentRes.body.data.status, 'sent');

      // Status: accepted
      const acceptRes = await supertest(app)
        .patch(`/api/referrals/${referralId}/status`)
        .set('Authorization', `Bearer ${staffB.token}`)
        .send({ status: 'accepted', note: 'Bed prepared' });
      assert.strictEqual(acceptRes.status, 200);
      assert.strictEqual(acceptRes.body.data.status, 'accepted');

      // Status: completed
      const completeRes = await supertest(app)
        .patch(`/api/referrals/${referralId}/status`)
        .set('Authorization', `Bearer ${staffB.token}`)
        .send({ status: 'completed', note: 'Treatment successful' });
      assert.strictEqual(completeRes.status, 200);
      assert.strictEqual(completeRes.body.data.status, 'completed');

      // Cannot update a completed referral
      const failRes = await supertest(app)
        .patch(`/api/referrals/${referralId}/status`)
        .set('Authorization', `Bearer ${staffB.token}`)
        .send({ status: 'sent' });
      assert.strictEqual(failRes.status, 400);
    });
  });

  /* =========================================================================
     6. NOTIFICATIONS & IN-APP DELIVERY
     ========================================================================= */
  describe('6. In-App Notifications API', () => {
    it('Manages user notifications, unread counts, and marking read', async () => {
      const { token, user } = await createTestUser({ role: 'patient' });

      const n1 = await Notification.create({
        user: user._id,
        title: 'Checkup',
        message: 'Tomorrow 10 AM',
        type: 'appointment',
        isRead: false
      });
      await Notification.create({
        user: user._id,
        title: 'Alert',
        message: 'Polio Sunday',
        type: 'system',
        isRead: false
      });

      // Unread count
      const countRes = await supertest(app)
        .get('/api/notifications/unread-count')
        .set('Authorization', `Bearer ${token}`);
      assert.strictEqual(countRes.body.data.unreadCount, 2);

      // Mark single read
      const readRes = await supertest(app)
        .patch(`/api/notifications/${n1._id}/read`)
        .set('Authorization', `Bearer ${token}`);
      assert.strictEqual(readRes.status, 200);
      assert.strictEqual(readRes.body.data.isRead, true);

      // Mark all read
      const readAllRes = await supertest(app)
        .patch('/api/notifications/read-all')
        .set('Authorization', `Bearer ${token}`);
      assert.strictEqual(readAllRes.status, 200);
      assert.strictEqual(readAllRes.body.data.updatedCount, 1);
    });
  });

  /* =========================================================================
     7. USER PROFILE & DASHBOARDS
     ========================================================================= */
  describe('7. Profile & Dashboard Role Protection', () => {
    it('PATCH /api/users/me updates profile but rejects privilege escalation', async () => {
      const { token } = await createTestUser({ role: 'patient', name: 'Original Patient' });

      const res = await supertest(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated Patient',
          role: 'admin' // Attempted privilege escalation
        });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.user.name, 'Updated Patient');
      assert.strictEqual(res.body.data.user.role, 'patient');
    });

    it('Dashboard role access verification: Patient, Staff, and Admin dashboards', async () => {
      const patient = await createTestUser({ role: 'patient' });
      const facility = await createTestFacility();
      const staff = await createTestUser({ role: 'staff', facilityId: facility._id });
      const admin = await createTestUser({ role: 'admin' });

      // Patient dashboard accessible to patient
      const patientRes = await supertest(app)
        .get('/api/dashboard/patient')
        .set('Authorization', `Bearer ${patient.token}`);
      assert.strictEqual(patientRes.status, 200);
      assert.ok(patientRes.body.data.stats !== undefined);

      // Staff dashboard rejects patient with 403, allows staff
      const staffDeniedRes = await supertest(app)
        .get('/api/dashboard/staff')
        .set('Authorization', `Bearer ${patient.token}`);
      assert.strictEqual(staffDeniedRes.status, 403);

      const staffAllowedRes = await supertest(app)
        .get('/api/dashboard/staff')
        .set('Authorization', `Bearer ${staff.token}`);
      assert.strictEqual(staffAllowedRes.status, 200);

      // Admin dashboard rejects patient with 403, allows admin
      const adminDeniedRes = await supertest(app)
        .get('/api/dashboard/admin')
        .set('Authorization', `Bearer ${patient.token}`);
      assert.strictEqual(adminDeniedRes.status, 403);

      const adminAllowedRes = await supertest(app)
        .get('/api/dashboard/admin')
        .set('Authorization', `Bearer ${admin.token}`);
      assert.strictEqual(adminAllowedRes.status, 200);
      assert.ok(adminAllowedRes.body.data.stats !== undefined);
    });
  });
});
