import api from './api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const notificationService = {
  async getNotifications() {
    if (!USE_MOCK) {
      try {
        const response = await api.get('/notifications');
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    return {
      success: true,
      data: [
        {
          _id: 'notif-demo-1',
          title: 'Polio Pulse National Immunization Drive',
          message: 'Immunization camp scheduled this Sunday at all Primary Health Centres.',
          type: 'system',
          isRead: false,
          createdAt: new Date().toISOString()
        }
      ]
    };
  },

  async getUnreadCount() {
    if (!USE_MOCK) {
      try {
        const response = await api.get('/notifications/unread-count');
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    return { success: true, data: { unreadCount: 1 } };
  },

  async markAsRead(id) {
    if (!USE_MOCK) {
      try {
        const response = await api.patch(`/notifications/${id}/read`);
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    return { success: true };
  },

  async markAllAsRead() {
    if (!USE_MOCK) {
      try {
        const response = await api.patch('/notifications/read-all');
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    return { success: true };
  }
};

export default notificationService;
