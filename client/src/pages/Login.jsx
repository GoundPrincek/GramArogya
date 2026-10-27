import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { LogIn, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login, t } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(formData);
      const userRole = res?.data?.user?.role;
      const redirectPath = location.state?.from?.pathname || (
        userRole === 'admin' ? '/admin/dashboard' :
        userRole === 'doctor' || userRole === 'staff' || userRole === 'asha_worker' ? '/staff/dashboard' :
        '/patient/dashboard'
      );
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '440px', padding: '4rem 1rem' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>
            {t('auth.loginTitle')}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
            Access healthcare services & dashboards
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: 'var(--color-emergency-bg)',
            color: 'var(--color-emergency)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Input
            label={t('auth.phone')}
            name="identifier"
            type="text"
            placeholder="10-digit mobile number or email"
            required
            value={formData.identifier}
            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
          />

          <Input
            label={t('auth.password')}
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.75rem' }}
          >
            <LogIn size={16} /> {loading ? 'Signing in...' : t('nav.login')}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            {t('nav.register')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
