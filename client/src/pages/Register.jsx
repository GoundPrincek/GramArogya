import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { UserPlus, AlertCircle } from 'lucide-react';
import { MAHARASHTRA_DISTRICTS } from '../utils/constants';

export const Register = () => {
  const { register, t } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    role: 'patient',
    district: 'Pune',
    taluka: '',
    preferredLanguage: 'mr'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        jurisdiction: {
          state: 'Maharashtra',
          district: formData.district,
          taluka: formData.taluka
        },
        preferredLanguage: formData.preferredLanguage
      });
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '520px', padding: '3rem 1rem' }}>
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>
            {t('auth.registerTitle')}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
            Register to schedule appointments and view referrals
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
            label={t('auth.name')}
            name="name"
            placeholder="e.g. Ramesh Patil"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label={t('auth.phone')}
            name="phone"
            placeholder="10-digit mobile number"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <Input
            label={t('auth.password')}
            name="password"
            type="password"
            placeholder="At least 6 characters"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <div className="grid sm:grid-cols-2" style={{ gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="patient">Citizen / Patient</option>
                <option value="asha_worker">ASHA Worker</option>
                <option value="staff">Health Staff / ANM</option>
                <option value="doctor">Medical Officer / Doctor</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">District (जिल्हा)</label>
              <select
                className="form-select"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              >
                {MAHARASHTRA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Taluka / Village (तालुका / गाव)"
            name="taluka"
            placeholder="e.g. Haveli / Wagholi"
            value={formData.taluka}
            onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
          />

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.75rem' }}
          >
            <UserPlus size={16} /> {loading ? 'Registering...' : t('nav.register')}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            {t('nav.login')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
