const test = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../src/app');

test('Health Check Endpoint — GET /api/health', async () => {
  const request = supertest(app);
  const response = await request.get('/api/health');

  assert.strictEqual(response.status, 200);
  assert.strictEqual(response.body.success, true);
  assert.strictEqual(response.body.data.status, 'healthy');
  assert.strictEqual(response.body.data.service, 'GramArogyaConnect-Backend');
});

test('Auth Endpoint Validation — POST /api/auth/register fails with empty payload', async () => {
  const request = supertest(app);
  const response = await request.post('/api/auth/register').send({});

  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.success, false);
  assert.ok(Array.isArray(response.body.errors));
});

test('Auth Endpoint Validation — POST /api/auth/login fails without credentials', async () => {
  const request = supertest(app);
  const response = await request.post('/api/auth/login').send({});

  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.success, false);
});
