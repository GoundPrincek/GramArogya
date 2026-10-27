import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { User, Phone, MapPin, Globe } from 'lucide-react';

export const PatientProfile = () => {
  const { user } = useAuth();

  return (
    <div>
      <DashboardHeader
        title="Citizen Health Profile"
        subtitle="Manage personal demographic details, rural jurisdiction, and language preference."
      />

      <div className="card" style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 700
          }}>
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', margin: 0 }}>
              {user?.name || 'Citizen User'}
            </h2>
            <span className="badge badge-info" style={{ marginTop: '0.25rem' }}>
              {user?.role || 'patient'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <Phone size={18} color="var(--color-primary-light)" />
            <span><strong>Mobile:</strong> {user?.phone || 'Not provided'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <MapPin size={18} color="var(--color-primary-light)" />
            <span><strong>Jurisdiction:</strong> {user?.jurisdiction?.taluka || 'Haveli'}, {user?.jurisdiction?.district || 'Pune'}, Maharashtra</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <Globe size={18} color="var(--color-primary-light)" />
            <span><strong>Preferred Language:</strong> {user?.preferredLanguage === 'mr' ? 'मराठी (Marathi)' : user?.preferredLanguage === 'hi' ? 'हिंदी (Hindi)' : 'English'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
