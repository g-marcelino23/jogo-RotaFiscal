import React, { useEffect, useRef } from 'react';
import { Award, AlertTriangle, ThumbsDown, FileText, RefreshCw, LogOut } from 'lucide-react';

// IMPORTAÇÃO DAS MÚSICAS (Ajuste o caminho conforme sua pasta)
// Se estiver usando Vite/Webpack e a pasta assets:
import winMusicFile from '../assets/win_music.mp3';
import neutralMusicFile from '../assets/neutral_music.mp3';
import failMusicFile from '../assets/fail_music.mp3';

// Se estiver usando pasta public, pode usar strings diretas no src do Audio:
// const winMusicFile = "/sounds/win_music.mp3"; 

// --- PALETA DE CORES (Mesma do GameScreen) ---
const COLORS = {
  primary: "#fbbf24", // Âmbar
  secondary: "#d97706",
  danger: "#ef4444",
  success: "#10b981",
  background: "#0c0a09", // Preto quente
  surface: "#1c1917", // Painel
  surfaceLight: "#292524",
  border: "#44403c",
  textPrimary: "#fafaf9",
  textSecondary: "#a8a29e",
};

const ResultsScreen = ({ data, onRestart, onExit }) => {
  const { correct, total, budgetFinal } = data;
  
  // Referência para o áudio para poder pausar ao sair
  const audioRef = useRef(null);

  // Determinar o estado do jogo
  let status = 'fail'; // default
  if (correct === total) status = 'success';
  else if (correct >= Math.ceil(total / 2)) status = 'neutral';

  // Configuração baseada no status
  let config = {
    title: '',
    description: '',
    icon: null,
    themeColor: '',
    music: null
  };

  switch (status) {
    case 'success':
      config = {
        title: 'PROMOÇÃO RECOMENDADA',
        description: 'Auditoria impecável. Seus relatórios foram considerados modelo de eficiência. A Superintendência aprovou sua indicação para Auditor-Chefe.',
        icon: <Award size={48} />,
        themeColor: COLORS.success, // Verde
        music: winMusicFile
      };
      break;
    case 'neutral':
      config = {
        title: 'MANUTENÇÃO DO CARGO',
        description: 'Desempenho dentro da média. Algumas inconsistências foram notadas, mas o resultado final foi aceitável. Você continua sob observação.',
        icon: <AlertTriangle size={48} />,
        themeColor: COLORS.primary, // Âmbar/Laranja
        music: neutralMusicFile
      };
      break;
    case 'fail':
    default:
      config = {
        title: 'EXONERAÇÃO IMEDIATA',
        description: 'Falha crítica nos protocolos. Decisões equivocadas causaram prejuízo ao erário ou injustiça fiscal. Seu acesso ao sistema foi revogado.',
        icon: <ThumbsDown size={48} />,
        themeColor: COLORS.danger, // Vermelho
        music: failMusicFile
      };
      break;
  }

  // Efeito para tocar a música ao montar o componente
  useEffect(() => {
    if (config.music) {
      audioRef.current = new Audio(config.music);
      audioRef.current.volume = 0.5; // Volume médio
      audioRef.current.play().catch(e => console.log("Autoplay bloqueado:", e));
    }

    // Cleanup: Parar música ao sair da tela
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [config.music]); // Executa apenas se a música mudar (na montagem)

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
              background: `${config.themeColor}15`, // Cor com transparência
              border: `2px solid ${config.themeColor}`,
              color: config.themeColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 20px ${config.themeColor}30`
            }}>
              {config.icon}
            </div>

            {/* Texto */}
            <div>
              <h1 style={{ margin: '0 0 10px 0', fontSize: 24, fontWeight: 800, color: config.themeColor, letterSpacing: 0.5 }}>
                {config.title}
              </h1>
              <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: COLORS.textSecondary }}>
                {config.description}
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