const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../src/app');
const { setupTestDB, teardownTestDB, clearTestDB, createTestUser, createTestFacility } = require('./testHelper');

describe('Healthcare Facilities API', () => {
  before(async () => {
    await setupTestDB();
  });

  after(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it('GET /api/facilities returns paginated facility listing', async () => {
    await createTestFacility({ name: 'PHC Wagholi', district: 'Pune', facilityType: 'PHC' });
    await createTestFacility({ name: 'RH Baramati', district: 'Pune', facilityType: 'CHC' });

    const res = await supertest(app).get('/api/facilities?page=1&limit=10');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.length, 2);
    assert.strictEqual(res.body.pagination.total, 2);
    assert.strictEqual(res.body.pagination.page, 1);
  });

  it('GET /api/facilities filters by district and facilityType', async () => {
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

  it('GET /api/facilities filters by service', async () => {
    await createTestFacility({
      name: 'Maternity Clinic',
      district: 'Pune',
      services: ['Maternal Health', 'Ultrasound']
    });
    await createTestFacility({
      name: 'General Dispensary',
      district: 'Pune',
      services: ['General OPD', 'Vaccination']
    });

    const res = await supertest(app).get('/api/facilities?service=Ultrasound');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.length, 1);
    assert.strictEqual(res.body.data[0].name, 'Maternity Clinic');
  });

  it('GET /api/facilities/:id returns a single facility', async () => {
    const facility = await createTestFacility({ name: 'Specific PHC' });

    const res = await supertest(app).get(`/api/facilities/${facility._id}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.name, 'Specific PHC');
  });

  it('GET /api/facilities/:id returns 404 for nonexistent id', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await supertest(app).get(`/api/facilities/${fakeId}`);

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.success, false);
  });

  it('POST /api/facilities is protected: rejects unauthenticated with 401', async () => {
    const res = await supertest(app).post('/api/facilities').send({
      name: 'Unauthorized Center',
      facilityType: 'PHC',
      district: 'Pune'
    });

    assert.strictEqual(res.status, 401);
  });

  it('POST /api/facilities rejects non-admin users with 403', async () => {
    const { token } = await createTestUser({ role: 'patient' });

    const res = await supertest(app)
      .post('/api/facilities')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Patient Created Center',
        facilityType: 'PHC',
        district: 'Pune'
      });

    assert.strictEqual(res.status, 403);
  });

  it('POST /api/facilities allows admin to create facility', async () => {
    const { token } = await createTestUser({ role: 'admin' });

    const res = await supertest(app)
      .post('/api/facilities')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Admin Hospital',
        facilityType: 'SubDistrictHospital',
        district: 'Nashik',
        taluka: 'Dindori',
        village: 'Dindori',
        services: ['Emergency Care', 'OPD']
      });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.name, 'New Admin Hospital');
    assert.strictEqual(res.body.data.facilityType, 'SubDistrictHospital');
  });
});
