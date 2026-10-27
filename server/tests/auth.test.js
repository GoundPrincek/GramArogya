const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../src/app');
const { setupTestDB, teardownTestDB, clearTestDB, createTestUser } = require('./testHelper');

describe('Authentication & Authorization API', () => {
  before(async () => {
    await setupTestDB();
  });

  after(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it('POST /api/auth/register successfully registers a new patient', async () => {
    const payload = {
      name: 'Ramesh Patil',
      phone: '9822123456',
      email: 'ramesh.patil@example.com',
      password: 'password123',
      preferredLanguage: 'mr',
      jurisdiction: {
        district: 'Pune',
        taluka: 'Haveli',
        village: 'Wagholi'
      }
    };

    const res = await supertest(app).post('/api/auth/register').send(payload);

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.user.name, 'Ramesh Patil');
    assert.strictEqual(res.body.data.user.phone, '9822123456');
    assert.strictEqual(res.body.data.user.role, 'patient');
    assert.strictEqual(res.body.data.user.passwordHash, undefined);
    assert.strictEqual(res.body.data.user.password, undefined);
    assert.ok(res.body.data.token);
  });

  it('POST /api/auth/register strictly enforces patient role even if client passes role="admin"', async () => {
    const payload = {
      name: 'Sneaky Attacker',
      phone: '9822999999',
      password: 'secretPassword123',
      role: 'admin'
    };

    const res = await supertest(app).post('/api/auth/register').send(payload);

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.success, true);
    // Must remain patient!
    assert.strictEqual(res.body.data.user.role, 'patient');
  });

  it('POST /api/auth/register rejects invalid input (phone too short, password too short)', async () => {
    const res = await supertest(app).post('/api/auth/register').send({
      name: 'A',
      phone: '1234',
      password: '123'
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(Array.isArray(res.body.errors));
    assert.ok(res.body.errors.length > 0);
  });

  it('POST /api/auth/register prevents duplicate phone registration', async () => {
    await createTestUser({ phone: '9822000001' });

    const res = await supertest(app).post('/api/auth/register').send({
      name: 'Second Ramesh',
      phone: '9822000001',
      password: 'password123'
    });

    assert.strictEqual(res.status, 409);
    assert.strictEqual(res.body.success, false);
  });

  it('POST /api/auth/login authenticates with valid credentials', async () => {
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
    assert.strictEqual(res.body.data.user.passwordHash, undefined);
  });

  it('POST /api/auth/login rejects incorrect password', async () => {
    await createTestUser({
      phone: '9822112233',
      password: 'correctPassword'
    });

    const res = await supertest(app).post('/api/auth/login').send({
      identifier: '9822112233',
      password: 'wrongPassword'
    });

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  it('POST /api/auth/login rejects unknown phone/email', async () => {
    const res = await supertest(app).post('/api/auth/login').send({
      identifier: '9999999999',
      password: 'anyPassword'
    });

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  it('GET /api/auth/me returns current user profile when authenticated', async () => {
    const { token, user } = await createTestUser({ name: 'Me User', phone: '9822555555' });

    const res = await supertest(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.user._id, user._id.toString());
    assert.strictEqual(res.body.data.user.phone, '9822555555');
  });

  it('GET /api/auth/me rejects unauthenticated request with 401', async () => {
    const res = await supertest(app).get('/api/auth/me');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  it('GET /api/auth/me rejects tampered JWT with 401', async () => {
    const res = await supertest(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token-value');

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
  });

  it('POST /api/auth/logout succeeds', async () => {
    const res = await supertest(app).post('/api/auth/logout');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
  });
});
