import React from 'react';

export const Input = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id || name} className="form-label">
          {label} {required && <span style={{ color: 'var(--color-emergency)' }}>*</span>}
        </label>
      )}
      <input
        id={id || name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`form-input ${className}`}
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default Input;
