import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import LanguageSwitcher from './LanguageSwitcher';
import notificationService from '../../services/notificationService';
import {
  Activity,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
  Stethoscope,
  Building,
  Bell,
  CheckCheck
} from 'lucide-react';

export const Navbar = () => {
  const { t } = useTranslation();
  const { user, switchDemoRole, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const [listRes, countRes] = await Promise.allSettled([
        notificationService.getNotifications(),
        notificationService.getUnreadCount()
      ]);
      if (listRes.status === 'fulfilled') {
        const list = Array.isArray(listRes.value?.data)
          ? listRes.value.data
          : (listRes.value?.data?.notifications || []);
        setNotifications(list);
      }
      if (countRes.status === 'fulfilled') {
        setUnreadCount(countRes.value?.data?.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleMarkRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      await fetchNotifications();
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await fetchNotifications();
    } catch {}
  };

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

          {/* Notifications & Active User Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
            {/* Notification Bell */}
            {user && (
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setNotifOpen(!notifOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.4rem',
                    borderRadius: 'var(--radius-sm)',
                    position: 'relative'
                  }}
                  title="Notifications & Alerts"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      backgroundColor: 'var(--color-emergency)',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '320px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    zIndex: 100,
                    padding: '0.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                        Notifications ({notifications.length})
                      </strong>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-secondary)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem'
                          }}
                        >
                          <CheckCheck size={13} /> Mark all read
                        </button>
                      )}
                    </div>

                    <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {notifications.length === 0 ? (
                        <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', textAlign: 'center', margin: '1rem 0' }}>
                          No notifications at this time.
                        </p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id || n.id}
                            style={{
                              padding: '0.5rem',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: n.isRead ? 'var(--color-bg-main)' : '#f0fdf4',
                              borderLeft: n.isRead ? '2px solid transparent' : '2px solid var(--color-success)',
                              fontSize: '0.8rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.2rem'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <strong style={{ color: 'var(--color-primary)' }}>{n.title}</strong>
                              {!n.isRead && (
                                <button
                                  type="button"
                                  onClick={(e) => handleMarkRead(n._id || n.id, e)}
                                  style={{ background: 'none', border: 'none', color: 'var(--color-secondary)', fontSize: '0.7rem', cursor: 'pointer', padding: 0 }}
                                >
                                  Read
                                </button>
                              )}
                            </div>
                            <span style={{ color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{n.message}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

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
