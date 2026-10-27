import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import LanguageSwitcher from './LanguageSwitcher';
import {
  Activity,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
  Stethoscope,
  Building
} from 'lucide-react';

export const Navbar = () => {
  const { t } = useTranslation();
  const { user, switchDemoRole, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'doctor' || user.role === 'staff' || user.role === 'asha_worker') return '/staff';
    return '/patient';
  };

  const linkStyle = ({ isActive }) => ({
    fontWeight: isActive ? 600 : 500,
    color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
    borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
    padding: '0.4rem 0',
    fontSize: '0.9rem'
  });

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Top Government & Demo Role Switcher Bar */}
      <div style={{
        backgroundColor: 'var(--color-primary-dark)',
        color: '#ffffff',
        padding: '0.35rem 1rem',
        fontSize: '0.78rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{t('app.state')}</span>
          <span style={{ opacity: 0.6 }}>|</span>
          <span style={{ color: 'var(--color-accent)' }}>SIH26133</span>
        </div>

        {/* Demo Fast-Switch Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
          <span style={{ opacity: 0.8 }}>Test Role:</span>
          <button
            onClick={() => { switchDemoRole('patient'); navigate('/patient'); }}
            style={{
              background: user?.role === 'patient' ? 'var(--color-accent)' : 'rgba(255,255,255,0.15)',
              color: user?.role === 'patient' ? '#081c15' : '#ffffff',
              border: 'none',
              padding: '0.15rem 0.45rem',
              borderRadius: '3px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Citizen
          </button>
          <button
            onClick={() => { switchDemoRole('doctor'); navigate('/staff'); }}
            style={{
              background: user?.role === 'doctor' || user?.role === 'staff' ? 'var(--color-accent)' : 'rgba(255,255,255,0.15)',
              color: user?.role === 'doctor' || user?.role === 'staff' ? '#081c15' : '#ffffff',
              border: 'none',
              padding: '0.15rem 0.45rem',
              borderRadius: '3px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Staff
          </button>
          <button
            onClick={() => { switchDemoRole('admin'); navigate('/admin'); }}
            style={{
              background: user?.role === 'admin' ? 'var(--color-accent)' : 'rgba(255,255,255,0.15)',
              color: user?.role === 'admin' ? '#081c15' : '#ffffff',
              border: 'none',
              padding: '0.15rem 0.45rem',
              borderRadius: '3px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '66px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            padding: '0.45rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(27,67,50,0.2)'
          }}>
            <Activity size={22} />
          </div>
          <div>
            <span style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              display: 'block',
              lineHeight: 1.1
            }}>
              GramArogya
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', letterSpacing: '0.8px', fontWeight: 600 }}>
              CONNECT &bull; ग्रामीण आरोग्य
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <NavLink to="/" style={linkStyle}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/facilities" style={linkStyle}>
            {t('nav.facilities')}
          </NavLink>
          <NavLink to={getDashboardPath()} style={linkStyle}>
            {t('nav.dashboard')}
          </NavLink>

          <LanguageSwitcher />

          {/* Active User Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to={getDashboardPath()}
              className="btn btn-secondary"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            >
              <User size={15} />
              <span>{user?.name?.split(' ')[0] || 'User'}</span>
              <span className="badge badge-info" style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                {user?.role}
              </span>
            </Link>
          </div>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="hide-on-desktop" style={{ display: 'none' }}>
            <LanguageSwitcher />
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-primary)',
              display: 'flex',
              padding: '0.5rem'
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--color-border)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.4rem 0' }}>{t('nav.home')}</Link>
          <Link to="/facilities" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.4rem 0' }}>{t('nav.facilities')}</Link>
          <Link to={getDashboardPath()} onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.4rem 0' }}>{t('nav.dashboard')}</Link>
          <div style={{ padding: '0.5rem 0' }}>
            <LanguageSwitcher />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
              {t('nav.login')}
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ flex: 1 }}>
              {t('nav.register')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
