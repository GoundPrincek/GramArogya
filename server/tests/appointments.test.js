const test = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../src/app');

test('Appointments Endpoint — POST /api/appointments requires authorization', async () => {
  const request = supertest(app);
  const response = await request.post('/api/appointments').send({});

  assert.strictEqual(response.status, 401);
  assert.strictEqual(response.body.success, false);
});

test('Appointments Endpoint — GET /api/appointments/my requires authorization', async () => {
  const request = supertest(app);
  const response = await request.get('/api/appointments/my');

  assert.strictEqual(response.status, 401);
  assert.strictEqual(response.body.success, false);
});
