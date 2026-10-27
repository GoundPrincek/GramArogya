import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Phone, Shield, MapPin, Heart } from 'lucide-react';

export const Footer = () => {
  const { t } = useAuth();

  return (
    <footer style={{
      backgroundColor: 'var(--color-primary-dark)',
      color: 'rgba(255, 255, 255, 0.85)',
      marginTop: 'auto',
      padding: '3rem 0 1.5rem'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem',
          paddingBottom: '2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Col 1: Platform Info */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.15rem', marginBottom: '0.75rem' }}>
              GramArogya Connect
            </h4>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.7)' }}>
              {t('app.subtitle')}
            </p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.75rem', color: 'var(--color-accent)' }}>
              Problem ID: SIH26133
            </p>
          </div>

          {/* Col 2: Emergency Helplines */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '0.75rem' }}>
              Emergency Helplines (महाराष्ट्र)
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--color-accent)" /> 108 — Emergency Ambulance
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--color-accent)" /> 102 — Pregnant Women & Infant Transport
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--color-accent)" /> 104 — Maharashtra Health Advice Helpline
              </li>
            </ul>
          </div>

          {/* Col 3: Healthcare Tiers */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '0.75rem' }}>
              Public Health Hierarchy
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'rgba(255, 255, 255, 0.7)' }}>
              <li>1. Sub-Centres (ASHA / ANM)</li>
              <li>2. Primary Health Centres (PHC)</li>
              <li>3. Community Health Centres (CHC)</li>
              <li>4. Sub-District & District Hospitals (Tertiary)</li>
            </ul>
          </div>
        </div>

        <div style={{
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.6)'
        }}>
          <div>
            © {new Date().getFullYear()} GramArogya Connect. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Built for rural healthcare coordination with <Heart size={14} color="var(--color-emergency)" /> in Maharashtra
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
