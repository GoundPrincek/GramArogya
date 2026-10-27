import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="container" style={{
      textAlign: 'center',
      padding: '6rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.25rem'
    }}>
      <span style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-primary-light)' }}>
        404
      </span>
      <h1 style={{ fontSize: '1.75rem', color: 'var(--color-primary)' }}>
        Page Not Found / पृष्ठ सापडले नाही
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '480px' }}>
        The healthcare portal page or resource you are looking for does not exist or has been relocated.
      </p>
      <Link to="/">
        <Button variant="primary">
          <Home size={16} /> Return to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
