const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../src/app');
const { setupTestDB, teardownTestDB } = require('./testHelper');

describe('Health Check API', () => {
  before(async () => {
    await setupTestDB();
  });

  after(async () => {
    await teardownTestDB();
  });

  it('GET /api/health returns healthy and database connected: true', async () => {
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
