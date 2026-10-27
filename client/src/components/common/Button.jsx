import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger'
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
