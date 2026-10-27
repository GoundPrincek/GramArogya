const test = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../src/app');

test('Facilities Validation — GET /api/facilities/nearby fails without lat/lng', async () => {
  const request = supertest(app);
  const response = await request.get('/api/facilities/nearby');

  assert.strictEqual(response.status, 400);
  assert.strictEqual(response.body.success, false);
  assert.ok(response.body.errors.some((err) => err.field === 'lat'));
});

test('Facilities Validation — POST /api/facilities requires auth', async () => {
  const request = supertest(app);
  const response = await request.post('/api/facilities').send({ name: 'Pune District Hospital' });

  assert.strictEqual(response.status, 401);
  assert.strictEqual(response.body.success, false);
});
