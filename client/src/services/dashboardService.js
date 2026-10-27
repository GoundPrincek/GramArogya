import api from './api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const dashboardService = {
  async getPatientDashboard() {
    if (!USE_MOCK) {
      try {
        const response = await api.get('/dashboard/patient');
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    return {
      success: true,
      data: {
        stats: {
          totalAppointments: 3,
          pendingAppointments: 1,
          acceptedAppointments: 2,
          activeReferrals: 1,
          unreadNotifications: 2
        },
        upcomingAppointments: [],
        recentReferrals: []
      }
    };
  },

  async getStaffDashboard() {
    if (!USE_MOCK) {
      try {
        const response = await api.get('/dashboard/staff');
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    return {
      success: true,
      data: {
        stats: {
          totalRequests: 8,
          pendingRequests: 3,
          acceptedRequests: 4,
          completedToday: 1,
          incomingReferrals: 2,
          outgoingReferrals: 1
        },
        recentAppointments: []
      }
    };
  },

  async getAdminDashboard() {
    if (!USE_MOCK) {
      try {
        const response = await api.get('/dashboard/admin');
        return response.data;
      } catch (err) {
        if (err.response) throw err;
      }
    }

    return {
      success: true,
      data: {
        stats: {
          totalFacilities: 4,
          activeFacilities: 4,
          totalUsers: 12,
          totalPatients: 8,
          totalStaff: 3,
          totalAppointments: 14,
          pendingAppointments: 4,
          totalReferrals: 5,
          activeReferrals: 2
        },
        breakdowns: {
          facilitiesByTier: { PHC: 2, CHC: 1, DistrictHospital: 1 },
          appointmentsByStatus: { pending: 4, accepted: 7, completed: 3 }
        }
      }
    };
  }
};

export default dashboardService;
