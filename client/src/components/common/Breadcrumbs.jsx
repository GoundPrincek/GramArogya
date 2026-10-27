import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: '1.25rem' }}>
      <ol style={{
        listStyle: 'none',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.4rem',
        padding: 0,
        margin: 0,
        fontSize: '0.85rem'
      }}>
        <li style={{ display: 'inline-flex', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Home size={14} /> Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <li style={{ color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center' }}>
                <ChevronRight size={14} />
              </li>
              <li style={{
                color: isLast ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: isLast ? 600 : 400
              }}>
                {item.to && !isLast ? (
                  <Link to={item.to} style={{ color: 'var(--color-text-secondary)' }}>
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
