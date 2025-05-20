import React from 'react';

export const Card = ({ className = '', children }) => {
  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  };

  return (
    <div style={cardStyle} className={className}>
      {children}
    </div>
  );
};

export const CardContent = ({ className = '', children }) => {
  const contentStyle = {
    padding: '16px',
  };

  return (
    <div style={contentStyle} className={className}>
      {children}
    </div>
  );
};
