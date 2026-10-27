import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Calendar,
  Share2,
  UserCheck,
  Building,
  BarChart3,
  LogOut,
  Home
} from 'lucide-react';

export const DashboardSidebar = () => {
  const { user, logout } = useAuth();
  const role = user?.role;

  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.65rem 1rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: isActive ? '#ffffff' : 'var(--color-text-secondary)',
    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
    transition: 'all var(--transition-fast)'
  });

  return (
    <aside style={{
      width: '240px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid var(--color-border)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      minHeight: 'calc(100vh - 100px)'
    }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', padding: '0 0.5rem 0.5rem' }}>
        {role?.toUpperCase()} MENU
      </div>

      {/* Patient Links */}
      {role === 'patient' && (
        <>
          <NavLink to="/patient/dashboard" style={linkStyle}>
            <LayoutDashboard size={18} /> Overview
          </NavLink>
          <NavLink to="/patient/appointments" style={linkStyle}>
            <Calendar size={18} /> My Appointments
          </NavLink>
          <NavLink to="/patient/referrals" style={linkStyle}>
            <Share2 size={18} /> My Referrals
          </NavLink>
          <NavLink to="/patient/profile" style={linkStyle}>
            <UserCheck size={18} /> Health Profile
          </NavLink>
        </>
      )}

      {/* Staff & Doctor Links */}
      {(role === 'staff' || role === 'doctor' || role === 'asha_worker') && (
        <>
          <NavLink to="/staff/dashboard" style={linkStyle}>
            <LayoutDashboard size={18} /> Clinical Overview
          </NavLink>
          <NavLink to="/staff/appointments" style={linkStyle}>
            <Calendar size={18} /> Manage Queue
          </NavLink>
          <NavLink to="/staff/referrals" style={linkStyle}>
            <Share2 size={18} /> Manage Referrals
          </NavLink>
        </>
      )}

      {/* Admin Links */}
      {role === 'admin' && (
        <>
          <NavLink to="/admin/dashboard" style={linkStyle}>
            <LayoutDashboard size={18} /> Admin Overview
          </NavLink>
          <NavLink to="/admin/users" style={linkStyle}>
            <UserCheck size={18} /> Manage Users
          </NavLink>
          <NavLink to="/admin/facilities" style={linkStyle}>
            <Building size={18} /> Manage Facilities
          </NavLink>
          <NavLink to="/admin/analytics" style={linkStyle}>
            <BarChart3 size={18} /> System Analytics
          </NavLink>
        </>
      )}

      <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <NavLink to="/" style={linkStyle}>
          <Home size={18} /> Back to Home
        </NavLink>
        <button
          onClick={logout}
          style={{
            ...linkStyle({ isActive: false }),
            border: 'none',
            background: 'none',
            width: '100%',
            cursor: 'pointer'
          }}
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
