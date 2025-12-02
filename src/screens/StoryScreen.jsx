import React from 'react';
import { ArrowRight, AlertTriangle, ShieldAlert } from 'lucide-react';

// Fundo: Ambiente de escritório noturno/foco
const BG_IMAGE = "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop";

const StoryScreen = ({ onContinue }) => {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundImage: `url(${BG_IMAGE})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Máscara escura */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(3px)' }} />

      {/* O "Dossiê" / Tablet */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: 'min(800px, 90vw)',
        background: '#0a0a0a',
        border: '1px solid #333',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Cabeçalho do Dossiê */}
        <div style={{
          padding: '20px 30px',
          borderBottom: '2px solid #facc15',
          background: '#111',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#facc15' }}>
            <ShieldAlert size={24} />
            <span style={{ fontFamily: 'Courier New, monospace', fontWeight: 'bold', letterSpacing: 2 }}>
              CONFIDENCIAL // RECEITA FEDERAL
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#666', fontFamily: 'Courier New, monospace' }}>
            DOC_ID: RFB-2025-FTZ
          </div>
        </div>

        {/* Corpo do Texto */}
        <div style={{ padding: '40px', color: '#e5e5e5', fontFamily: 'Courier New, monospace', lineHeight: 1.6, fontSize: '15px' }}>
          
          <h2 style={{ fontSize: '24px', margin: '0 0 20px 0', textTransform: 'uppercase', color: '#fff' }}>
            Operação: Rota Fiscal
          </h2>

          <p style={{ marginBottom: '20px', color: '#9ca3af' }}>
            <strong>AGENTE:</strong> Você foi designado para a rota prioritária de Fortaleza.
            <br/>
            <strong>DATA:</strong> 22/09/2025
          </p>

          <p style={{ marginBottom: '15px' }}>
            Hoje é o fechamento anual. Temos <strong>4 empresas</strong> sob suspeita de irregularidades graves. 
            Relatórios de inteligência indicam incompatibilidade entre o padrão de vida dos sócios e o faturamento declarado.
          </p>

          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            borderLeft: '4px solid #ef4444', 
            padding: '15px', 
            margin: '25px 0',
            fontSize: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontWeight: 'bold', marginBottom: 5 }}>
              <AlertTriangle size={16} /> RISCO DE CARREIRA
            </div>
            Brasília está monitorando. Decisões erradas resultarão em exoneração imediata.
            Seu objetivo é claro: identificar fraudes e validar empresas honestas.
          </div>

          <p>
            Revise os dados. Assista às filmagens. Decida.
          </p>
        </div>

        {/* Rodapé com Botão */}
        <div style={{ padding: '20px 40px', background: '#111', borderTop: '1px solid #333', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onContinue}
            style={{
              padding: '12px 24px',
              background: '#facc15',
              color: '#000',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#eab308'}
            onMouseLeave={e => e.currentTarget.style.background = '#facc15'}
          >
            Aceitar Missão <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default StoryScreen;