import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, ShieldAlert, Heart, Building, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer style={{
      backgroundColor: 'var(--color-primary-dark)',
      color: 'rgba(255, 255, 255, 0.85)',
      marginTop: 'auto',
      padding: '3rem 0 1.5rem',
      borderTop: '3px solid var(--color-accent)'
    }}>
      <div className="container">
        {/* Notice on Emergency Medical Care */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem'
        }}>
          <ShieldAlert size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
            <strong>Important Healthcare Notice:</strong> GramArogya Connect is an access and coordination platform designed for outpatient appointment requests, healthcare center discovery, and clinical referral tracking. <strong>This platform does not provide emergency medical treatment or dispatch emergency ambulances.</strong> For acute medical emergencies, call the Government of Maharashtra emergency helplines: <strong>108</strong> (Ambulance) or <strong>102</strong> (Maternal & Infant Transport).
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Column 1: Platform Overview */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.75rem', fontWeight: 700 }}>
              GramArogya Connect
            </h4>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.75)' }}>
              {t('app.subtitle')}
            </p>
            <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--color-accent)' }}>
              Problem ID: SIH26133 &bull; Phase 1 Prototype
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '0.75rem', fontWeight: 600 }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/facilities" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                  Find Healthcare Facilities
                </Link>
              </li>
              <li>
                <Link to="/patient" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                  Patient Portal
                </Link>
              </li>
              <li>
                <Link to="/staff" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                  Medical Staff Portal
                </Link>
              </li>
              <li>
                <Link to="/admin" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                  District Administration
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Maharashtra Public Health Helplines */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '0.75rem', fontWeight: 600 }}>
              Public Health Helplines
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={14} color="var(--color-accent)" />
                <span>108 — Maharashtra Emergency Ambulance</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={14} color="var(--color-accent)" />
                <span>102 — Free Maternal & Child Transport</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={14} color="var(--color-accent)" />
                <span>104 — Maharashtra Health Advice Helpline</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Rural Health Tiers */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '0.75rem', fontWeight: 600 }}>
              Public Health Hierarchy
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              <li>1. Sub-Centres (ASHA / ANM)</li>
              <li>2. Primary Health Centres (PHC)</li>
              <li>3. Community Health Centres (CHC)</li>
              <li>4. Sub-District & District Hospitals</li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal / Phase 1 Notice */}
        <div style={{
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          <div>
            &copy; {new Date().getFullYear()} GramArogya Connect &bull; Designed for rural public health coordination in Maharashtra
          </div>
          <div>
            Phase 1 Frontend Prototype &bull; Synthetic Demonstration Data
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
