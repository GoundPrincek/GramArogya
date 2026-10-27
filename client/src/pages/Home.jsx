import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import FacilitySearch from '../components/facilities/FacilitySearch';
import Button from '../components/common/Button';
import {
  HeartHandshake,
  Hospital,
  MapPin,
  Calendar,
  Share2,
  PhoneCall,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';

export const Home = () => {
  const { t } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
        color: '#ffffff',
        padding: '4rem 1rem 5rem',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            <ShieldAlert size={16} color="var(--color-accent)" />
            <span>Problem ID: SIH26133 &bull; Maharashtra Rural Health Mission</span>
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '1rem',
            letterSpacing: '-0.5px'
          }}>
            GramArogya Connect
          </h1>

          <p style={{
            fontSize: '1.2rem',
            color: 'var(--color-accent-subtle)',
            marginBottom: '0.5rem',
            fontWeight: 500
          }}>
            A Rural Public Healthcare Access and Coordination Platform
          </p>

          <p style={{
            fontSize: '1rem',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '2rem',
            maxWidth: '650px',
            margin: '0 auto 2rem'
          }}>
            {t('home.welcome')}. Bridging rural sub-centers, Primary Health Centres (PHC),
            and District Hospitals across Maharashtra.
          </p>

          {/* Quick Search */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '0.5rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            gap: '0.5rem',
            maxWidth: '580px',
            margin: '0 auto'
          }}>
            <FacilitySearch
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={t('home.searchPlaceholder')}
            />
            <Link to={`/facilities?search=${encodeURIComponent(searchTerm)}`}>
              <Button variant="primary">
                Search
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Rural Healthcare Tier */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)' }}>
            Integrated Healthcare Delivery Hierarchy
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Strengthening primary triage and facilitating tertiary hospital referrals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card" style={{ borderTop: '4px solid #52b788' }}>
            <span className="badge badge-info" style={{ marginBottom: '0.5rem' }}>Tier 1</span>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>Sub-Centre</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
              Grassroots care led by ASHA workers & ANMs providing maternal monitoring and first aid.
            </p>
          </div>

          <div className="card" style={{ borderTop: '4px solid #2d6a4f' }}>
            <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>Tier 2</span>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>Primary Health Centre (PHC)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
              First-contact doctor consultations, 24x7 normal deliveries, OPD, and essential diagnostics.
            </p>
          </div>

          <div className="card" style={{ borderTop: '4px solid #f4a261' }}>
            <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>Tier 3</span>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>Community Health Centre (CHC)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
              Secondary emergency trauma care, basic surgical units, obstetrics, and inpatient beds.
            </p>
          </div>

          <div className="card" style={{ borderTop: '4px solid #e63946' }}>
            <span className="badge badge-emergency" style={{ marginBottom: '0.5rem' }}>Tier 4</span>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>District Hospital</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
              Tertiary multi-specialty care, intensive care units (ICU), advanced imaging, and blood banks.
            </p>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="container">
        <div className="card" style={{
          backgroundColor: '#ffffff',
          padding: '2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          <div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-accent-subtle)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <MapPin size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>Geospatial Facility Map</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Locate open health centers, check emergency hours, and get proximity routing across Maharashtra talukas.
            </p>
          </div>

          <div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-accent-subtle)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Calendar size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>OPD Queue & Token Booking</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Avoid long queues at rural health centers with citizen and ASHA worker appointment scheduling.
            </p>
          </div>

          <div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-accent-subtle)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <Share2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)' }}>Inter-Facility Digital Referral</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Closed-loop clinical referral escalations from PHC to CHC or District Hospital with real-time tracking.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
