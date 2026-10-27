import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import PatientLayout from '../layouts/PatientLayout';
import StaffLayout from '../layouts/StaffLayout';
import AdminLayout from '../layouts/AdminLayout';

// Common Route Guard
import ProtectedRoute from '../components/common/ProtectedRoute';

// Public Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import Facilities from '../pages/facilities/Facilities';
import FacilityDetails from '../pages/facilities/FacilityDetails';

// Patient Pages
import PatientDashboard from '../pages/patient/PatientDashboard';
import MyAppointments from '../pages/patient/MyAppointments';
import MyReferrals from '../pages/patient/MyReferrals';
import PatientProfile from '../pages/patient/PatientProfile';

// Staff Pages
import StaffDashboard from '../pages/staff/StaffDashboard';
import ManageAppointments from '../pages/staff/ManageAppointments';
import ManageReferrals from '../pages/staff/ManageReferrals';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageFacilities from '../pages/admin/ManageFacilities';
import Analytics from '../pages/admin/Analytics';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/facilities/:id" element={<FacilityDetails />} />
      </Route>

      {/* Patient Portal */}
      <Route
        path="/patient"
        element={
          <ProtectedRoute allowedRoles={['patient', 'asha_worker', 'admin']}>
            <PatientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<PatientDashboard />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="appointments" element={<MyAppointments />} />
        <Route path="referrals" element={<MyReferrals />} />
        <Route path="profile" element={<PatientProfile />} />
      </Route>

      {/* Medical Officer & Staff Portal */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={['staff', 'doctor', 'asha_worker', 'admin']}>
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboard />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="appointments" element={<ManageAppointments />} />
        <Route path="referrals" element={<ManageReferrals />} />
      </Route>

      {/* District Health Administration Portal */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="facilities" element={<ManageFacilities />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
