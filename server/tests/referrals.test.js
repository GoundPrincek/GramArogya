const test = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../src/app');

test('Referrals Endpoint — POST /api/referrals requires auth', async () => {
  const request = supertest(app);
  const response = await request.post('/api/referrals').send({});

  assert.strictEqual(response.status, 401);
  assert.strictEqual(response.body.success, false);
});

test('Referrals Endpoint — GET /api/referrals/my requires auth', async () => {
  const request = supertest(app);
  const response = await request.get('/api/referrals/my');

  assert.strictEqual(response.status, 401);
  assert.strictEqual(response.body.success, false);
});
