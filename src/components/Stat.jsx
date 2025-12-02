import React from 'react';

const Stat = ({ label, value }) => (
  <div style={{
    flex: '1 1 px',
    padding: 10,
    borderRadius: 6,
    border: '1px solid #1f2937',
    background: '#030712'
  }}>
    <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>{label}</div>
    <div style={{ fontWeight: 600 }}>{value}</div>
  </div>
);

export default Stat;