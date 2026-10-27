import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../hooks/useAuth';
import {
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  Building,
  Info
} from 'lucide-react';

const appointmentSchema = z.object({
  service: z.string().min(1, 'Please select a healthcare service'),
  appointmentDate: z.string().min(1, 'Please select a preferred date'),
  timeSlot: z.string().min(1, 'Please select a preferred time slot'),
  patientName: z.string().min(2, 'Full name must be at least 2 characters'),
  patientPhone: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  symptoms: z.string().min(5, 'Please provide a brief description of symptoms (min 5 chars)')
});

export const AppointmentRequestModal = ({ isOpen, onClose, facility, onSuccess }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Form, 2: Review, 3: Success Confirmation
  const [submittedData, setSubmittedData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Available services from facility demonstration data
  const availableServices = (facility?.services && facility.services.length > 0)
    ? facility.services
    : (facility?.servicesAvailable && facility.servicesAvailable.length > 0)
      ? facility.servicesAvailable
      : [
          'General OPD Consultation',
          'Maternal & Antenatal Checkup',
          'Infant & Child Immunization'
        ];

  // Minimum date is tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      service: availableServices[0] || '',
      appointmentDate: minDateString,
      timeSlot: '09:30 AM - 11:00 AM',
      patientName: user?.name || '',
      patientPhone: user?.phone || '',
      symptoms: ''
    }
  });

  const onProceedToReview = () => {
    setStep(2);
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      const formValues = getValues();
      const payload = {
        facilityId: facility._id,
        facilityName: facility.name,
        tier: facility.tier,
        district: facility.district,
        taluka: facility.taluka,
        requestedService: formValues.service,
        appointmentDate: formValues.appointmentDate,
        timeSlot: formValues.timeSlot,
        patientName: formValues.patientName,
        patientPhone: formValues.patientPhone,
        symptoms: formValues.symptoms
      };

      const res = await appointmentService.bookAppointment(payload);
      setSubmittedData(res.data);
      setStep(3);
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      console.error('Error submitting appointment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setStep(1);
    setSubmittedData(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 3 ? 'Request Recorded' : `Request Appointment — ${facility?.name}`}
    >
      {/* Step 1: Input Form */}
      {step === 1 && (
        <form onSubmit={handleSubmit(onProceedToReview)} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="notice-box-warning" style={{ padding: '0.65rem 0.85rem', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)' }}>
            <Info size={16} style={{ flexShrink: 0 }} />
            <span>
              <strong>Demonstration Notice:</strong> This request is recorded locally in this prototype. Outpatient consultation tokens are simulated.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">{t('appointments.chooseService')} *</label>
            <select className="form-select" {...register('service')}>
              {availableServices.map((srv, idx) => (
                <option key={idx} value={srv}>
                  {srv}
                </option>
              ))}
            </select>
            {errors.service && <span className="form-error"><AlertCircle size={12} /> {errors.service.message}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">{t('appointments.selectDate')} *</label>
              <input
                type="date"
                min={minDateString}
                className="form-input"
                {...register('appointmentDate')}
              />
              {errors.appointmentDate && <span className="form-error"><AlertCircle size={12} /> {errors.appointmentDate.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('appointments.selectTimeSlot')} *</label>
              <select className="form-select" {...register('timeSlot')}>
                <option value="09:00 AM - 10:30 AM">Morning (09:00 AM - 10:30 AM)</option>
                <option value="10:30 AM - 12:00 PM">Midday (10:30 AM - 12:00 PM)</option>
                <option value="02:00 PM - 03:30 PM">Afternoon (02:00 PM - 03:30 PM)</option>
                <option value="03:30 PM - 05:00 PM">Late Afternoon (03:30 PM - 05:00 PM)</option>
              </select>
              {errors.timeSlot && <span className="form-error"><AlertCircle size={12} /> {errors.timeSlot.message}</span>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">{t('appointments.patientName')} *</label>
              <input
                type="text"
                placeholder="e.g. Sunita Patil"
                className="form-input"
                {...register('patientName')}
              />
              {errors.patientName && <span className="form-error"><AlertCircle size={12} /> {errors.patientName.message}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">{t('appointments.patientPhone')} *</label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                className="form-input"
                {...register('patientPhone')}
              />
              {errors.patientPhone && <span className="form-error"><AlertCircle size={12} /> {errors.patientPhone.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{t('appointments.symptoms')} *</label>
            <textarea
              rows={3}
              placeholder="Briefly describe symptoms or medical reason for consultation..."
              className="form-textarea"
              {...register('symptoms')}
            />
            {errors.symptoms && <span className="form-error"><AlertCircle size={12} /> {errors.symptoms.message}</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="secondary" onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button variant="primary" type="submit">
              Proceed to Review
            </Button>
          </div>
        </form>
      )}

      {/* Step 2: Review Screen */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Please review the consultation details before submitting your demonstration request:
          </p>

          <div style={{
            backgroundColor: 'var(--color-bg-main)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            fontSize: '0.9rem'
          }}>
            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.78rem' }}>HEALTH FACILITY</span>
              <strong>{facility?.name} ({facility?.tier})</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                {facility?.taluka}, {facility?.district}
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.78rem' }}>REQUESTED SERVICE</span>
              <span>{getValues().service}</span>
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.78rem' }}>DATE</span>
                <span>{getValues().appointmentDate}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.78rem' }}>TIME SLOT</span>
                <span>{getValues().timeSlot}</span>
              </div>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.78rem' }}>PATIENT</span>
              <span>{getValues().patientName} &bull; {getValues().patientPhone}</span>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.78rem' }}>SYMPTOMS</span>
              <span>{getValues().symptoms}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="secondary" onClick={() => setStep(1)} disabled={submitting}>
              Back to Edit
            </Button>
            <Button variant="primary" onClick={handleFinalSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Confirm and Submit Request'}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Success Screen */}
      {step === 3 && (
        <div style={{ textAlign: 'center', padding: '1rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-success-bg)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckCircle2 size={36} />
          </div>

          <div>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--color-primary)', margin: 0 }}>
              {t('appointments.successTitle')}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: '0.5rem auto 0' }}>
              {t('appointments.successDesc')}
            </p>
          </div>

          {submittedData && (
            <div style={{
              backgroundColor: 'var(--color-bg-main)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1.5rem'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>REQUEST STATUS</span>
                <span className="badge badge-pending">Pending Review</span>
              </div>
              <div style={{ borderLeft: '1px solid var(--color-border)', paddingLeft: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>QUEUE TOKEN</span>
                <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>#{submittedData.tokenNumber}</strong>
              </div>
            </div>
          )}

          <div style={{
            backgroundColor: '#fefce8',
            border: '1px solid #fef08a',
            color: '#854d0e',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.825rem',
            maxWidth: '460px'
          }}>
            <strong>Important Phase 1 Notice:</strong> A pending request is not a confirmed appointment. No live data has been sent to a real hospital database.
          </div>

          <Button variant="primary" onClick={handleClose}>
            Done & Return
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default AppointmentRequestModal;
