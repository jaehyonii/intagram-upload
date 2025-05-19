import React from 'react';

export const Button = ({ className = '', children, ...props }) => {
  return (
    <button
      className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
