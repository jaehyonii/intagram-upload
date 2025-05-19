import React from 'react';

export const Card = ({ className = '', children }) => {
  return (
    <div className={`border rounded-xl shadow-md bg-white ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ className = '', children }) => {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
};
