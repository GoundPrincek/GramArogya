import React from 'react';
import AppointmentStatus from './AppointmentStatus';
import { formatDate } from '../../utils/formatDate';
import { Calendar, Clock, MapPin, Hash } from 'lucide-react';

export const AppointmentCard = ({ appointment }) => {
  const { facilityId, appointmentDate, timeSlot, tokenNumber, department, status, symptoms } = appointment;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            backgroundColor: 'var(--color-accent-subtle)',
            color: 'var(--color-primary-dark)',
            padding: '0.2rem 0.5rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem'
          }}>
            <Hash size={14} /> Token #{tokenNumber}
          </span>
          <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{department}</span>
        </div>
        <AppointmentStatus status={status} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MapPin size={16} color="var(--color-primary-light)" />
          <span>{facilityId?.name || 'Assigned Health Facility'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Calendar size={16} color="var(--color-primary-light)" />
          <span>{formatDate(appointmentDate)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock size={16} color="var(--color-primary-light)" />
          <span>{timeSlot}</span>
        </div>
      </div>

      {symptoms && (
        <div style={{
          backgroundColor: 'var(--color-bg-main)',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem'
        }}>
          <strong>Reported Symptoms:</strong> {symptoms}
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
