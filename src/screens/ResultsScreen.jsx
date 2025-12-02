import React from 'react';
import { Award, AlertTriangle, ThumbsDown, FileText, RefreshCw, LogOut } from 'lucide-react';

// --- PALETA DE CORES (Mesma do GameScreen) ---
const COLORS = {
  primary: "#fbbf24", // Âmbar
  secondary: "#d97706",
  background: "#0c0a09", // Preto quente
  surface: "#1c1917", // Painel
  surfaceLight: "#292524",
  border: "#44403c",
  textPrimary: "#fafaf9",
  textSecondary: "#a8a29e",
  glow: "rgba(251, 191, 36, 0.2)",
};

const ResultsScreen = ({ data, onRestart, onExit }) => {
  const { correct, total, budgetFinal } = data;
  let title, description, icon, themeColor;

  // Lógica de Resultado
  if (correct === total) {
    title = 'PROMOÇÃO RECOMENDADA';
    description = 'Auditoria impecável. Seus relatórios foram considerados modelo de eficiência. A Superintendência aprovou sua indicação para Auditor-Chefe.';
    icon = <Award size={48} />;
    themeColor = '#10b981'; // Verde Sucesso
  } else if (correct >= Math.ceil(total / 2)) {
    title = 'MANUTENÇÃO DO CARGO';
    description = 'Desempenho dentro da média. Algumas inconsistências foram notadas, mas o resultado final foi aceitável. Você continua sob observação.';
    icon = <AlertTriangle size={48} />;
    themeColor = '#f59e0b'; // Laranja Alerta
  } else {
    title = 'EXONERAÇÃO IMEDIATA';
    description = 'Falha crítica nos protocolos. Decisões equivocadas causaram prejuízo ao erário ou injustiça fiscal. Seu acesso ao sistema foi revogado.';
    icon = <ThumbsDown size={48} />;
    themeColor = '#ef4444'; // Vermelho Erro
  }

  return (
    <div style={{
      height: '100vh', width: '100vw',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: COLORS.background,
      color: COLORS.textPrimary,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative', overflow: 'hidden'
    }}>
      
      {/* Efeito Scanline de Fundo */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px)",
        opacity: 0.3
      }} />

      {/* Cartão do Relatório */}
      <div style={{
        width: 'min(700px, 90vw)',
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        boxShadow: `0 20px 50px rgba(0,0,0,0.5)`,
        zIndex: 10,
        display: 'flex', flexDirection: 'column'
      }}>
        
        {/* Cabeçalho */}
        <div style={{
          padding: '20px 30px',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: COLORS.surfaceLight
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={20} color={COLORS.primary} />
            <span style={{ fontWeight: 700, letterSpacing: 1, fontSize: 14, color: COLORS.textSecondary, textTransform: 'uppercase' }}>
              Relatório Final de Auditoria
            </span>
          </div>
          <div style={{ fontSize: 12, color: COLORS.textSecondary, fontFamily: 'monospace' }}>
            REF: {Date.now().toString().slice(-6)}
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div style={{ padding: '40px 30px' }}>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: 30 }}>
            {/* Ícone do Resultado */}
            <div style={{
              padding: 20,
              borderRadius: '50%',
              background: `${themeColor}15`, // Cor com transparência
              border: `2px solid ${themeColor}`,
              color: themeColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 20px ${themeColor}30`
            }}>
              {icon}
            </div>

            {/* Texto */}
            <div>
              <h1 style={{ margin: '0 0 10px 0', fontSize: 24, fontWeight: 800, color: themeColor, letterSpacing: 0.5 }}>
                {title}
              </h1>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: COLORS.textSecondary }}>
                {description}
              </p>
            </div>
          </div>

          {/* Estatísticas (Grid) */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 30 }}>
            <div style={{ flex: 1, background: COLORS.surfaceLight, padding: 16, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 6, textTransform: 'uppercase', fontWeight: 600 }}>Precisão da Análise</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.textPrimary }}>
                {correct} <span style={{fontSize: 16, color: COLORS.textSecondary, fontWeight: 400}}>/ {total} Casos</span>
              </div>
            </div>
            
            <div style={{ flex: 1, background: COLORS.surfaceLight, padding: 16, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: 12, color: COLORS.textSecondary, marginBottom: 6, textTransform: 'uppercase', fontWeight: 600 }}>Orçamento Final</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: budgetFinal > 0 ? COLORS.primary : COLORS.danger }}>
                R$ {budgetFinal.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 20, borderTop: `1px solid ${COLORS.border}` }}>
            <button
              onClick={onExit}
              style={{
                padding: '12px 20px',
                background: 'transparent',
                border: `1px solid ${COLORS.border}`,
                color: COLORS.textSecondary,
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.danger; e.currentTarget.style.color = COLORS.danger; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textSecondary; }}
            >
              <LogOut size={16} /> Encerrar Sessão
            </button>

            <button
              onClick={onRestart}
              style={{
                padding: '12px 24px',
                background: COLORS.primary,
                border: 'none',
                color: '#000',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 8,
                transition: 'transform 0.1s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = COLORS.secondary; }}
              onMouseLeave={e => { e.currentTarget.style.background = COLORS.primary; }}
            >
              <RefreshCw size={16} /> Nova Rota
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;