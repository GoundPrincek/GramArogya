import React from 'react';
import DashboardSidebar from './DashboardSidebar';

export const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-main)' }}>
      <DashboardSidebar />
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
