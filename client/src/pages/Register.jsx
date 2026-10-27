import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import DemoBanner from '../components/common/DemoBanner';
import { MAHARASHTRA_DISTRICTS } from '../utils/constants';
import { UserPlus, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number (e.g. 9822011223)'),
  email: z.string().email('Invalid email address format').or(z.literal('')).optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  district: z.string().min(1, 'Please select your district'),
  taluka: z.string().min(2, 'Taluka or village name is required'),
  preferredLanguage: z.enum(['mr', 'hi', 'en']),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to public healthcare coordination terms' })
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export const Register = () => {
  const { t, i18n } = useTranslation();
  const { register: registerAuth, setLanguage } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      district: 'Pune',
      taluka: '',
      preferredLanguage: i18n.language || 'mr',
      consent: false
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await registerAuth({
        name: data.name,
        phone: data.phone,
        email: data.email,
        password: data.password,
        role: 'patient',
        jurisdiction: {
          district: data.district,
          taluka: data.taluka
        },
        preferredLanguage: data.preferredLanguage
      });
      setLanguage(data.preferredLanguage);
      navigate('/patient');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <DemoBanner />

      <div className="container" style={{ maxWidth: '520px', padding: '2.5rem 1rem 4rem' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--color-primary)',
            fontSize: '0.85rem',
            fontWeight: 500,
            marginBottom: '1.25rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Homepage
        </Link>

        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', color: 'var(--color-primary)', margin: 0 }}>
              {t('auth.registerTitle')}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              {t('auth.registerSubtitle')}
            </p>
          </div>

          {errorMessage && (
            <div style={{
              backgroundColor: 'var(--color-emergency-bg)',
              border: '1px solid var(--color-emergency-border)',
              color: 'var(--color-emergency)',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                {t('auth.fullName')} *
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Sunita Ramesh Patil"
                className="form-input"
                {...register('name')}
              />
              {errors.name && (
                <span className="form-error">
                  <AlertCircle size={12} /> {errors.name.message}
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  {t('auth.phone')} *
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  className="form-input"
                  {...register('phone')}
                />
                {errors.phone && (
                  <span className="form-error">
                    <AlertCircle size={12} /> {errors.phone.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  {t('auth.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="form-input"
                  {...register('email')}
                />
                {errors.email && (
                  <span className="form-error">
                    <AlertCircle size={12} /> {errors.email.message}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="district">
                  {t('auth.district')} *
                </label>
                <select id="district" className="form-select" {...register('district')}>
                  {MAHARASHTRA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.district && (
                  <span className="form-error">
                    <AlertCircle size={12} /> {errors.district.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="taluka">
                  {t('auth.taluka')} *
                </label>
                <input
                  id="taluka"
                  type="text"
                  placeholder="e.g. Haveli / Wagholi"
                  className="form-input"
                  {...register('taluka')}
                />
                {errors.taluka && (
                  <span className="form-error">
                    <AlertCircle size={12} /> {errors.taluka.message}
                  </span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="preferredLanguage">
                {t('auth.preferredLanguage')} *
              </label>
              <select id="preferredLanguage" className="form-select" {...register('preferredLanguage')}>
                <option value="mr">मराठी (Marathi)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="en">English</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  {t('auth.password')} *
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  className="form-input"
                  {...register('password')}
                />
                {errors.password && (
                  <span className="form-error">
                    <AlertCircle size={12} /> {errors.password.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">
                  {t('auth.confirmPassword')} *
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  className="form-input"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <span className="form-error">
                    <AlertCircle size={12} /> {errors.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>

            <div style={{ margin: '0.35rem 0' }}>
              <label className="form-checkbox-label">
                <input type="checkbox" {...register('consent')} />
                <span>{t('auth.consentTerms')}</span>
              </label>
              {errors.consent && (
                <span className="form-error" style={{ marginTop: '0.25rem' }}>
                  <AlertCircle size={12} /> {errors.consent.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <UserPlus size={16} /> {isSubmitting ? t('common.submitting') : t('nav.register')}
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              {t('nav.login')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
