import React from 'react';
import AppointmentStatus from './AppointmentStatus';
import { formatDate } from '../../utils/formatDate';
import { Calendar, Clock, MapPin, Hash, XCircle, FileText } from 'lucide-react';

export const AppointmentCard = ({ appointment, onCancel }) => {
  const facilityName =
    appointment.facility?.name ||
    appointment.facilityId?.name ||
    appointment.facilityName ||
    'Assigned Health Facility';

  const appointmentDate = appointment.preferredDate || appointment.appointmentDate;
  const timeSlot = appointment.preferredTime || appointment.timeSlot;
  const tokenNumber = appointment.tokenNumber || 1;
  const department = appointment.requestedService || appointment.department || 'General Medicine';
  const status = appointment.status || 'pending';
  const symptoms = appointment.notes || appointment.symptoms;
  const decisionReason = appointment.decisionReason;
  const consultationNotes = appointment.consultationNotes;

  const canCancel = ['pending', 'accepted', 'scheduled'].includes(status.toLowerCase());

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
          <span>{facilityName}</span>
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
          <strong>Reported Symptoms / Notes:</strong> {symptoms}
        </div>
      )}

      {decisionReason && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem'
        }}>
          <strong>Review Note / Reason:</strong> {decisionReason}
        </div>
      )}

      {consultationNotes && (
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#1e40af',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem'
        }}>
          <strong>Consultation Notes:</strong> {consultationNotes}
        </div>
      )}

      {canCancel && onCancel && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ color: 'var(--color-emergency)', borderColor: 'var(--color-emergency)', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
            onClick={() => onCancel(appointment._id || appointment.id)}
          >
            <XCircle size={14} /> Cancel Request
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
