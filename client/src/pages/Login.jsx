import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import DemoBanner from '../components/common/DemoBanner';
import {
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  UserCheck,
  Stethoscope,
  Shield,
  Info
} from 'lucide-react';

const loginSchema = z.object({
  identifier: z.string().min(3, 'Please enter a valid mobile number or email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
});

export const Login = () => {
  const { t } = useTranslation();
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '9822011223', // Default citizen demo phone
      password: 'demopassword123',
      rememberMe: true
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await login(data);
      const redirectPath = location.state?.from?.pathname || '/patient';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = (role, path) => {
    switchDemoRole(role);
    navigate(path);
  };

  return (
    <div>
      <DemoBanner />

      <div className="container" style={{ maxWidth: '460px', padding: '3rem 1rem 4rem' }}>
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
              {t('auth.signInTitle')}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              {t('auth.signInSubtitle')}
            </p>
          </div>

          {/* Quick Demo Login Selector */}
          <div style={{
            backgroundColor: 'var(--color-bg-main)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              {t('auth.quickDemoLogin')}
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => handleQuickDemo('patient', '/patient')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.2rem' }}
              >
                <UserCheck size={13} /> {t('auth.demoCitizen')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('doctor', '/staff')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.2rem' }}
              >
                <Stethoscope size={13} /> {t('auth.demoStaff')}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin', '/admin')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.2rem' }}
              >
                <Shield size={13} /> {t('auth.demoAdmin')}
              </button>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.4rem', textAlign: 'center' }}>
              {t('auth.demoNote')}
            </span>
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
              <label className="form-label" htmlFor="identifier">
                {t('auth.identifier')} *
              </label>
              <input
                id="identifier"
                type="text"
                className="form-input"
                placeholder="10-digit mobile number or email"
                {...register('identifier')}
              />
              {errors.identifier && (
                <span className="form-error">
                  <AlertCircle size={12} /> {errors.identifier.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                {t('auth.password')} *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  style={{ paddingRight: '40px' }}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="form-error">
                  <AlertCircle size={12} /> {errors.password.message}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <label className="form-checkbox-label">
                <input type="checkbox" {...register('rememberMe')} />
                <span>{t('auth.rememberMe')}</span>
              </label>

              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-secondary)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.825rem'
                }}
              >
                {t('auth.forgotPassword')}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              <LogIn size={16} /> {isSubmitting ? t('common.submitting') : t('nav.login')}
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              {t('nav.register')}
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Demonstration Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Password Recovery (Demonstration Notice)"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
          <div className="notice-box-warning">
            <Info size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Phase 1 Prototype Notice:</strong> In this frontend demonstration, password recovery does not send an actual SMS or email OTP.
            </div>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            In Phase 2, entering a verified 10-digit mobile number will trigger an OTP through the Maharashtra Public Health SMS Gateway. For testing now, use the <strong>One-Click Demo Roles</strong> on the sign-in screen.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={() => setForgotModalOpen(false)}>
              Understood
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Login;
