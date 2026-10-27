const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const app = require('../src/app');
const Notification = require('../src/models/Notification');
const {
  setupTestDB,
  teardownTestDB,
  clearTestDB,
  createTestUser
} = require('./testHelper');

describe('Notifications API', () => {
  before(async () => {
    await setupTestDB();
  });

  after(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  it('GET /api/notifications returns user notifications and count', async () => {
    const { token, user } = await createTestUser({ role: 'patient' });

    await Notification.create([
      {
        user: user._id,
        title: 'Appointment Reminder',
        message: 'Your checkup is tomorrow at 10 AM',
        type: 'appointment',
        isRead: false
      },
      {
        user: user._id,
        title: 'General Health Alert',
        message: 'Polio vaccination drive this Sunday',
        type: 'system',
        isRead: true
      }
    ]);

    const res = await supertest(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.length, 2);
    assert.strictEqual(res.body.count, 2);
  });

  it('GET /api/notifications/unread-count returns accurate count', async () => {
    const { token, user } = await createTestUser({ role: 'patient' });

    await Notification.create({
      user: user._id,
      title: 'Reminder 1',
      message: 'Pending message',
      type: 'appointment',
      isRead: false
    });

    const res = await supertest(app)
      .get('/api/notifications/unread-count')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.unreadCount, 1);
  });

  it('PATCH /api/notifications/:id/read marks notification as read', async () => {
    const { token, user } = await createTestUser({ role: 'patient' });

    const notif = await Notification.create({
      user: user._id,
      title: 'Alert',
      message: 'Notice text',
      type: 'appointment',
      isRead: false
    });

    const res = await supertest(app)
      .patch(`/api/notifications/${notif._id}/read`)
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.isRead, true);
    assert.ok(res.body.data.readAt);
  });

  it('PATCH /api/notifications/read-all marks all notifications for user as read', async () => {
    const { token, user } = await createTestUser({ role: 'patient' });

    await Notification.create([
      { user: user._id, title: 'N1', message: 'M1', type: 'system', isRead: false },
      { user: user._id, title: 'N2', message: 'M2', type: 'system', isRead: false }
    ]);

    const res = await supertest(app)
      .patch('/api/notifications/read-all')
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.data.updatedCount, 2);

    const countRes = await supertest(app)
      .get('/api/notifications/unread-count')
      .set('Authorization', `Bearer ${token}`);
    assert.strictEqual(countRes.body.data.unreadCount, 0);
  });

  it('Isolation: User A cannot mark User B notification as read', async () => {
    const userA = await createTestUser({ role: 'patient', phone: '9822111111' });
    const userB = await createTestUser({ role: 'patient', phone: '9822222222' });

    const notifB = await Notification.create({
      user: userB.user._id,
      title: 'User B private notification',
      message: 'Private content',
      type: 'system',
      isRead: false
    });

    const res = await supertest(app)
      .patch(`/api/notifications/${notifB._id}/read`)
      .set('Authorization', `Bearer ${userA.token}`);

    assert.strictEqual(res.status, 404);
  });
});
