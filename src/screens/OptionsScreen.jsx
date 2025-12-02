import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const OptionsScreen = ({ volume, onChangeVolume, onBack }) => {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#020617'
    }}>
      <div style={{
        width: 340,
        padding: 24,
        borderRadius: 8,
        border: '1px solid #374151',
        background: '#020617'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: 20 }}>Opções</h2>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 14, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 8 }}>
            Volume da música de fundo
            {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={e => onChangeVolume(parseFloat(e.target.value))}
            style={{ width: '100%', marginTop: 8 }}
          />
        </div>
        <button
          onClick={onBack}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #4b5563',
            background: '#111827',
            color: '#e5e7eb',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: 1
          }}
        >
          Voltar
        </button>
      </div>
    </div>
  );
};

export default OptionsScreen;