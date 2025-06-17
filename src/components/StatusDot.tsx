import React from 'react'

type StatusDotProps = {
  status: 'success' | 'rejected'
};

export const StatusDot: React.FC<StatusDotProps> = ({ status }) => {
  const size = 10
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: status === 'success' ? 'green' : 'red',
        display: 'inline-block',
      }}
    />
  );
};
