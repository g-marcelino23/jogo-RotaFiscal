import React from 'react';

const MenuButton = ({ children, onClick, icon }) => (
  <button
    onClick={onClick}
    style={{
      padding: '12px 32px',
      minWidth: '200px',
      background: 'rgba(0, 0, 0, 0.4)', // Fundo semi-transparente
      border: '2px solid rgba(255, 255, 255, 0.8)', // Borda clara
      borderRadius: '4px',
      color: '#fff',
      cursor: 'pointer',
      fontFamily: 'system-ui, sans-serif',
      fontWeight: '800', // Fonte grossa
      fontSize: '14px',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      backdropFilter: 'blur(4px)', // Efeito de vidro
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
      e.currentTarget.style.color = '#000';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
      e.currentTarget.style.color = '#fff';
    }}
  >
    {icon}
    {children}
  </button>
);

export default MenuButton;