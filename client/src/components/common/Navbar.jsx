import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LanguageSwitcher from './LanguageSwitcher';
import { Activity, Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, t } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'doctor' || user.role === 'staff' || user.role === 'asha_worker') return '/staff/dashboard';
    return '/patient/dashboard';
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Top Banner for Emergency Helpline */}
      <div style={{
        backgroundColor: 'var(--color-primary-dark)',
        color: '#ffffff',
        padding: '0.35rem 1rem',
        fontSize: '0.8rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>{t('app.state')}</span>
        <span>{t('home.emergencyBanner')}</span>
      </div>

      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '68px'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            padding: '0.45rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Activity size={24} />
          </div>
          <div>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              display: 'block',
              lineHeight: 1.1
            }}>
              GramArogya
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', letterSpacing: '0.5px' }}>
              CONNECT
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              fontWeight: 500,
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'
            })}
          >
            {t('nav.home')}
          </NavLink>
          <NavLink
            to="/facilities"
            style={({ isActive }) => ({
              fontWeight: 500,
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'
            })}
          >
            {t('nav.facilities')}
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to={getDashboardLink()}
              style={({ isActive }) => ({
                fontWeight: 500,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              })}
            >
              <LayoutDashboard size={16} />
              {t('nav.dashboard')}
            </NavLink>
          )}

          <LanguageSwitcher />

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              >
                <LogOut size={16} />
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem' }}>
                <User size={16} />
                {t('nav.login')}
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.85rem' }}>
                {t('nav.register')}
              </Link>
            </div>
          )}
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
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--color-border)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>{t('nav.home')}</Link>
          <Link to="/facilities" onClick={() => setMobileMenuOpen(false)}>{t('nav.facilities')}</Link>
          {isAuthenticated && (
            <Link to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>
              {t('nav.dashboard')}
            </Link>
          )}
          <LanguageSwitcher />
          {isAuthenticated ? (
            <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="btn btn-secondary">
              {t('nav.logout')}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                {t('nav.login')}
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ flex: 1 }}>
                {t('nav.register')}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
