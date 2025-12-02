import React from 'react';
import { X, BookOpen, ChevronRight, Calculator } from 'lucide-react';

// --- PALETA DE CORES (Consistente com o GameScreen) ---
const COLORS = {
  primary: "#fbbf24", // Âmbar
  surface: "#1c1917", // Fundo do painel
  surfaceLight: "#292524", // Fundo dos cartões
  border: "#44403c",
  textPrimary: "#fafaf9",
  textSecondary: "#a8a29e",
};

const RulesPanel = ({ onClose }) => {
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000
      }}
    >
      <div
        style={{
          width: 'min(800px, 90vw)', maxHeight: '90vh',
          background: COLORS.surface,
          borderRadius: 8, border: `1px solid ${COLORS.primary}`,
          boxShadow: `0 0 40px rgba(251, 191, 36, 0.15)`,
          display: 'flex', flexDirection: 'column'
        }}
      >
        {/* Cabeçalho */}
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: COLORS.surfaceLight
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: COLORS.primary }}>
            <BookOpen size={20} />
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
              Manual de Fiscalização
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none', color: COLORS.textSecondary,
              cursor: 'pointer', padding: 4, display: 'flex'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div style={{ padding: '24px', overflowY: 'auto', color: COLORS.textPrimary, fontFamily: 'system-ui, sans-serif' }}>
          
          <p style={{ color: COLORS.textSecondary, marginBottom: 24, fontSize: 14, borderLeft: `3px solid ${COLORS.primary}`, paddingLeft: 12 }}>
            Utilize este guia para cruzar os dados declarados pelas empresas. Se o valor pago for <strong>menor</strong> que o cálculo abaixo, a empresa deve ser autuada.
          </p>

          {/* 1. SIMPLES NACIONAL */}
          <div style={{ marginBottom: 20, background: COLORS.surfaceLight, padding: 16, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 15, color: COLORS.primary, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calculator size={16} /> 1. Simples Nacional
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
              <RateCard label="Comércio" value="8%" />
              <RateCard label="Indústria" value="10%" />
              <RateCard label="Serviços" value="12%" />
            </div>
            <p style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 10 }}>
              * Cálculo: Faturamento x Alíquota acima.
            </p>
          </div>

          {/* 2. LUCRO PRESUMIDO */}
          <div style={{ marginBottom: 20, background: COLORS.surfaceLight, padding: 16, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 15, color: COLORS.primary, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calculator size={16} /> 2. Lucro Presumido
            </h3>
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              <div style={{ marginBottom: 8 }}><strong style={{color: '#fff'}}>Base de Cálculo:</strong> 32% (Serviços) ou 8% (Outros) sobre o Faturamento.</div>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', color: COLORS.textSecondary }}>
                <li style={{display:'flex', alignItems:'center', gap:6}}><ChevronRight size={12}/> IRPJ: 15% sobre a base.</li>
                <li style={{display:'flex', alignItems:'center', gap:6}}><ChevronRight size={12}/> CSLL: 9% sobre a base.</li>
                <li style={{display:'flex', alignItems:'center', gap:6}}><ChevronRight size={12}/> PIS/COFINS: 3.65% sobre o faturamento total.</li>
              </ul>
            </div>
          </div>

          {/* 3. LUCRO REAL */}
          <div style={{ background: COLORS.surfaceLight, padding: 16, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: 15, color: COLORS.primary, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calculator size={16} /> 3. Lucro Real
            </h3>
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              <p style={{ margin: '0 0 8px 0', color: '#fff' }}>Baseado no lucro líquido real informado pela empresa.</p>
              <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', color: COLORS.textSecondary }}>
                <li style={{display:'flex', alignItems:'center', gap:6}}><ChevronRight size={12}/> IRPJ: 15% (+10% adicional se lucro alto).</li>
                <li style={{display:'flex', alignItems:'center', gap:6}}><ChevronRight size={12}/> CSLL: 9% sobre o lucro.</li>
                <li style={{display:'flex', alignItems:'center', gap:6}}><ChevronRight size={12}/> PIS/COFINS: 9.25% sobre o faturamento.</li>
              </ul>
            </div>
          </div>

        </div>
        
        {/* Rodapé do Modal */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${COLORS.border}`, textAlign: 'right' }}>
          <button
            onClick={onClose}
            style={{
              background: COLORS.primary, color: '#000',
              border: 'none', padding: '10px 20px', borderRadius: 4,
              fontWeight: 'bold', cursor: 'pointer', fontSize: 13,
              textTransform: 'uppercase'
            }}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar simples para os cartões de porcentagem
const RateCard = ({ label, value }) => (
  <div style={{ background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 4, border: `1px solid ${COLORS.border}`, textAlign: 'center' }}>
    <div style={{ fontSize: 11, color: COLORS.textSecondary, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary }}>{value}</div>
  </div>
);

export default RulesPanel;