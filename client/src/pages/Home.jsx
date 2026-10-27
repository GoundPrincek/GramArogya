import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FacilitySearch from '../components/facilities/FacilitySearch';
import FacilityCard from '../components/facilities/FacilityCard';
import DemoBanner from '../components/common/DemoBanner';
import Button from '../components/common/Button';
import { MOCK_FACILITIES } from '../data/mockFacilities';
import {
  Search,
  Calendar,
  Share2,
  BookOpen,
  MapPin,
  CheckCircle2,
  HeartPulse,
  Languages,
  Shield,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const featuredFacilities = MOCK_FACILITIES.slice(0, 3);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/facilities?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <div>
      <DemoBanner />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 70%, var(--color-primary-light) 100%)',
        color: '#ffffff',
        padding: '3.5rem 1rem 4.5rem',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '0.35rem 0.95rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.825rem',
            marginBottom: '1.25rem',
            color: 'var(--color-accent-subtle)'
          }}>
            <HeartPulse size={16} color="var(--color-accent)" />
            <span>Problem ID: SIH26133 &bull; Rural Healthcare Access & Coordination</span>
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '1rem',
            letterSpacing: '-0.5px'
          }}>
            {t('home.welcome')}
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '2rem',
            lineHeight: 1.6,
            maxWidth: '720px',
            margin: '0 auto 2rem'
          }}>
            {t('home.heroDesc')}
          </p>

          {/* Main Search Bar Form */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              backgroundColor: '#ffffff',
              padding: '0.5rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              gap: '0.5rem',
              maxWidth: '640px',
              margin: '0 auto'
            }}
          >
            <FacilitySearch
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={t('home.searchPlaceholder')}
            />
            <Button variant="primary" type="submit" style={{ whiteSpace: 'nowrap' }}>
              <Search size={16} /> {t('common.search')}
            </Button>
          </form>
        </div>
      </section>

      {/* Quick-Action Cards Section */}
      <section className="container" style={{ marginTop: '-2.5rem', position: 'relative', zIndex: 10 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem'
        }}>
          {/* Quick Action 1: Find Healthcare Facilities */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-accent-subtle)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.25rem'
            }}>
              <MapPin size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', margin: 0 }}>
              {t('home.quickActions.findFacilityTitle')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {t('home.quickActions.findFacilityDesc')}
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
              <Link to="/facilities" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                Browse Directory <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Quick Action 2: Request Appointment */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-secondary-subtle)',
              color: 'var(--color-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.25rem'
            }}>
              <Calendar size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', margin: 0 }}>
              {t('home.quickActions.requestApptTitle')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {t('home.quickActions.requestApptDesc')}
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
              <Link to="/facilities" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                Choose Center & Book <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Quick Action 3: Track Referral */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#fef3c7',
              color: '#b45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.25rem'
            }}>
              <Share2 size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', margin: 0 }}>
              {t('home.quickActions.trackReferralTitle')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {t('home.quickActions.trackReferralDesc')}
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
              <Link to="/patient/referrals" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                Track Transfer Status <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Quick Action 4: Healthcare Information */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#f1f5f9',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.25rem'
            }}>
              <BookOpen size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', margin: 0 }}>
              {t('home.quickActions.healthInfoTitle')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {t('home.quickActions.healthInfoDesc')}
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
              <a href="#awareness" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                View Health Advice <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / 3-Step Patient Journey */}
      <section className="container" style={{ padding: '4rem 1rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', margin: 0 }}>
            {t('home.howItWorks')}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            A coordinated pathway ensuring timely medical attention across Maharashtra talukas
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          <div className="card" style={{ borderTop: '4px solid var(--color-primary)', textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              fontSize: '1.25rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              1
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              {t('home.step1Title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              {t('home.step1Desc')}
            </p>
          </div>

          <div className="card" style={{ borderTop: '4px solid var(--color-secondary)', textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-secondary)',
              color: '#ffffff',
              fontSize: '1.25rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              2
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              {t('home.step2Title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              {t('home.step2Desc')}
            </p>
          </div>

          <div className="card" style={{ borderTop: '4px solid var(--color-accent)', textAlign: 'center', padding: '2rem 1.5rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-accent)',
              color: '#081c15',
              fontSize: '1.25rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              3
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              {t('home.step3Title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              {t('home.step3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Public Healthcare Facilities */}
      <section className="container" style={{ padding: '2rem 1rem 3rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', margin: 0 }}>
              {t('home.featuredTitle')}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {t('home.featuredSubtitle')}
            </p>
          </div>
          <Link to="/facilities" className="btn btn-secondary">
            View All Facilities ({MOCK_FACILITIES.length}) <ArrowRight size={15} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {featuredFacilities.map((fac) => (
            <FacilityCard key={fac._id} facility={fac} />
          ))}
        </div>
      </section>

      {/* Accessibility & Multilingual Highlights */}
      <section style={{ backgroundColor: '#ffffff', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '3.5rem 1rem' }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--color-accent-subtle)',
              color: 'var(--color-primary)',
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}>
              <Languages size={15} /> Built for Rural Digital Literacy
            </div>
            <h2 style={{ fontSize: '1.85rem', color: 'var(--color-primary)', lineHeight: 1.3, marginBottom: '1rem' }}>
              Multilingual and Accessible by Design
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              GramArogya Connect features first-class localization in <strong>Marathi (मराठी)</strong>, <strong>Hindi (हिंदी)</strong>, and <strong>English</strong>, ensuring that citizens and ASHA workers can navigate healthcare without language barriers.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="var(--color-success)" /> Fast loading under 2G / 3G rural mobile network speeds
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="var(--color-success)" /> High-contrast typography and clear labels for elderly patients
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="var(--color-success)" /> Screen reader compatible semantic HTML structure
              </li>
            </ul>
          </div>

          <div className="card" style={{ backgroundColor: 'var(--color-bg-main)', padding: '2rem' }}>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Platform Language Preference
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <strong>मराठी (Marathi)</strong> &bull; प्राथमिक आरोग्य केंद्र व रुग्णालय सेवा
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <strong>हिंदी (Hindi)</strong> &bull; ग्रामीण सार्वजनिक स्वास्थ्य समन्वय
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <strong>English</strong> &bull; Public Healthcare Access & Referral Tracking
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Public Healthcare Awareness Section */}
      <section id="awareness" className="container" style={{ padding: '4rem 1rem 5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-primary)', margin: 0 }}>
            {t('home.awarenessTitle')}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
            Key public health initiatives supported across Maharashtra public health centers
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          <div className="card">
            <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              Maternal & Child Health (MCH)
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              {t('home.maternalCare')}
            </p>
          </div>

          <div className="card">
            <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              Routine Immunization
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              {t('home.immunization')}
            </p>
          </div>

          <div className="card">
            <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              Vector & Seasonal Disease Control
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              {t('home.surveillance')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
