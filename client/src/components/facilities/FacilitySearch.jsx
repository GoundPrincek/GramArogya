import React from 'react';
import { Search } from 'lucide-react';

export const FacilitySearch = ({ value, onChange, placeholder = 'Search by name, village, or PIN code...' }) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Search
        size={18}
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-text-muted)'
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input"
        style={{
          paddingLeft: '38px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)'
        }}
      />
    </div>
  );
};

export default FacilitySearch;
