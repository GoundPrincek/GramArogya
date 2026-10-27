import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import Button from '../../components/common/Button';
import authService from '../../services/authService';
import { MAHARASHTRA_DISTRICTS } from '../../utils/constants';
import {
  User,
  Phone,
  MapPin,
  Globe,
  Edit2,
  CheckCircle,
  AlertCircle,
  Save,
  X
} from 'lucide-react';

export const PatientProfile = () => {
  const { user, setLanguage } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    district: user?.jurisdiction?.district || 'Pune',
    taluka: user?.jurisdiction?.taluka || 'Haveli',
    preferredLanguage: user?.preferredLanguage || 'mr'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        district: user.jurisdiction?.district || 'Pune',
        taluka: user.jurisdiction?.taluka || 'Haveli',
        preferredLanguage: user.preferredLanguage || 'mr'
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Name cannot be empty.');
      return;
    }

    try {
      setSaving(true);
      await authService.updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        jurisdiction: {
          district: formData.district,
          taluka: formData.taluka.trim()
        },
        preferredLanguage: formData.preferredLanguage
      });

      if (formData.preferredLanguage) {
        setLanguage(formData.preferredLanguage);
      }

      setNotification({
        type: 'success',
        message: 'Your health profile has been successfully updated.'
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setNotification({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update profile. Please verify your details.'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Citizen Health Profile"
        subtitle="Manage personal demographic details, rural jurisdiction, and language preference."
      />

      {notification && (
        <div
          style={{
            maxWidth: '640px',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: notification.type === 'success' ? 'var(--color-success-bg)' : '#fee2e2',
            color: notification.type === 'success' ? 'var(--color-success)' : '#dc2626',
            border: `1px solid ${notification.type === 'success' ? '#86efac' : '#fca5a5'}`
          }}
        >
          {notification.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 'bold' }}
          >
            &times;
          </button>
        </div>
      )}

      <div className="card" style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              <span className="badge badge-routine" style={{ marginTop: '0.25rem' }}>
                {user?.role || 'patient'}
              </span>
            </div>
          </div>

          {!isEditing && (
            <Button
              variant="secondary"
              className="btn-sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 size={14} /> Edit Profile
            </Button>
          )}
        </div>

        {!isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
              <Phone size={18} color="var(--color-primary-light)" />
              <span><strong>Mobile Number:</strong> {user?.phone || 'Not provided'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
              <MapPin size={18} color="var(--color-primary-light)" />
              <span><strong>Jurisdiction:</strong> {user?.jurisdiction?.taluka || 'Haveli'}, {user?.jurisdiction?.district || 'Pune'}, Maharashtra</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
              <Globe size={18} color="var(--color-primary-light)" />
              <span>
                <strong>Preferred Language:</strong>{' '}
                {user?.preferredLanguage === 'mr' ? 'मराठी (Marathi)' : user?.preferredLanguage === 'hi' ? 'हिंदी (Hindi)' : 'English'}
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">District *</label>
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

              <div className="form-group">
                <label className="form-label">Taluka / Village *</label>
                <input
                  type="text"
                  value={formData.taluka}
                  onChange={(e) => setFormData({ ...formData, taluka: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Portal Language</label>
              <select
                className="form-select"
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
              >
                <option value="mr">मराठी (Marathi)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="en">English</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Button
                variant="secondary"
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                <X size={14} /> Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={saving}
              >
                <Save size={14} /> {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PatientProfile;