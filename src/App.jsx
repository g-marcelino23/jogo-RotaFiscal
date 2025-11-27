import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Map as MapIcon,
  Volume2,
  VolumeX,
  Play,
  Info,
  DoorOpen,
  Siren,
  CheckCircle,
  Radio,
  Crosshair,
  MonitorPlay,
  Award,
  AlertTriangle,
  ThumbsDown
} from 'lucide-react';

// ------------------- CONSTANTES GERAIS -------------------

const TOTAL_EMPRESAS = 4;

// ------------------- COMPONENTE PRINCIPAL -------------------

const App = () => {
  const [screen, setScreen] = useState('menu');
  const [volume, setVolume] = useState(0.5);
  const [resultsData, setResultsData] = useState(null); // dados finais da rodada

  // callback chamado quando o jogo termina
  const handleGameEnd = (stats) => {
    setResultsData(stats);
    setScreen('results');
  };

  const handleExit = () => {
    // tenta fechar a aba – alguns browsers bloqueiam, mas em app desktop (electron) funcionaria
    window.close();
  };

  return (
    <div style={{ height: '100vh', background: '#050509', color: '#e5e5e5', fontFamily: 'system-ui, sans-serif' }}>
      {screen === 'menu' && (
        <MenuScreen
          onStart={() => setScreen('story')}
          onOptions={() => setScreen('options')}
          onExit={handleExit}
        />
      )}

      {screen === 'options' && (
        <OptionsScreen
          volume={volume}
          onChangeVolume={setVolume}
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'story' && (
        <StoryScreen
          onContinue={() => setScreen('game')}
        />
      )}

      {screen === 'game' && (
        <GameScreen
          volume={volume}
          onEndGame={handleGameEnd}
        />
      )}

      {screen === 'results' && resultsData && (
        <ResultsScreen
          data={resultsData}
          onRestart={() => {
            setResultsData(null);
            setScreen('menu');
          }}
          onExit={handleExit}
        />
      )}
    </div>
  );
};

// ------------------- TELA DE MENU -------------------

const MenuScreen = ({ onStart, onOptions, onExit }) => {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background:
        'radial-gradient(circle at top, #1f2937 0, #020617 45%, #000 100%)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <MonitorPlay size={48} color="#facc15" />
        </div>
        <h1 style={{ fontSize: 32, margin: 0, letterSpacing: 4, textTransform: 'uppercase' }}>
          ROTA FISCAL
        </h1>
        <p style={{ marginTop: 8, color: '#9ca3af', fontSize: 14 }}>
          Simulador de Auditoria Tributária – Fortaleza/CE
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 260 }}>
        <MenuButton onClick={onStart} icon={<Play size={18} />}>
          Iniciar jogo
        </MenuButton>

        <MenuButton onClick={onOptions} icon={<Volume2 size={18} />}>
          Opções
        </MenuButton>

        <MenuButton onClick={onExit} icon={<DoorOpen size={18} />} danger>
          Sair do jogo
        </MenuButton>
      </div>
    </div>
  );
};

const MenuButton = ({ children, onClick, icon, danger }) => (
  <button
    onClick={onClick}
    style={{
      padding: '10px 16px',
      borderRadius: 6,
      border: '1px solid ' + (danger ? '#b91c1c' : '#4b5563'),
      background: danger ? '#450a0a' : '#111827',
      color: danger ? '#fecaca' : '#e5e7eb',
      cursor: 'pointer',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      textTransform: 'uppercase',
      fontSize: 12,
      letterSpacing: 2
    }}
  >
    <span>{children}</span>
    {icon}
  </button>
);

// ------------------- TELA DE OPÇÕES -------------------

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

// ------------------- TELA DE HISTÓRIA / CONTEXTO -------------------

const StoryScreen = ({ onContinue }) => {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background:
        'linear-gradient(to bottom, #020617 0, #020617 55%, #000 100%)',
      color: '#e5e7eb',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>
          Dia D na Receita Federal em Fortaleza
        </h2>
        <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 24 }}>
          Você é o auditor responsável pela rota fiscal que cruza os principais bairros de Fortaleza.
        </p>

        <div style={{
          borderLeft: '3px solid #facc15',
          paddingLeft: 16,
          marginBottom: 24,
          fontSize: 14,
          lineHeight: 1.6
        }}>
          <p>
            Hoje não é um dia qualquer. É o fechamento anual das fiscalizações das
            quatro empresas que estão sob a sua responsabilidade direta. Os relatórios
            preliminares já apontam movimentações suspeitas, escolhas questionáveis de
            regime tributário e declarações que não batem com a realidade.
          </p>
          <p>
            Seu trabalho é simples no papel e tenso na prática: analisar cada caso,
            confrontar faturamento, regime e imposto pago, e decidir se a empresa
            está em conformidade ou se tentou burlar o fisco.
          </p>
          <p>
            O problema é que desta vez há muito mais em jogo. A superintendência em
            Brasília está acompanhando sua rota em tempo real. Um desempenho
            exemplar pode render a promoção mais disputada da regional nordeste.
            Mas uma série de decisões equivocadas pode encerrar sua carreira na
            Receita de forma definitiva.
          </p>
          <p style={{ color: '#facc15', marginTop: 8 }}>
            Quatro empresas. Um dia decisivo. Sua reputação em jogo.
          </p>
        </div>

        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 24 }}>
          A cada empresa, você verá o local no mapa, imagens do ambiente e as
          informações da denúncia. Com base no regime tributário e nos valores
          declarados, cabe a você decidir se aprova a situação ou aplica as sanções.
        </p>

        <button
          onClick={onContinue}
          style={{
            padding: '10px 20px',
            borderRadius: 6,
            border: '1px solid #facc15',
            background: '#1f2937',
            color: '#facc15',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            textTransform: 'uppercase',
            fontSize: 12,
            letterSpacing: 2
          }}
        >
          Iniciar rota de fiscalização
          <MapIcon size={16} />
        </button>
      </div>
    </div>
  );
};

// ------------------- TELA DE JOGO (SEU MAPA + LÓGICA TRIBUTÁRIA) -------------------

const GameScreen = ({ volume, onEndGame }) => {
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);
  const [budget, setBudget] = useState(100000);
  const [correctDecisions, setCorrectDecisions] = useState(0);
  const [showRules, setShowRules] = useState(false);


  // Funções de cálculo simplificadas

  const calcSimples = (faturamento, tipo) => {
    // alíquotas médias simplificadas por atividade
    const aliquotas = {
      Comercio: 0.08,
      Servicos: 0.12,
      Industria: 0.10
    };
    const aliq = aliquotas[tipo] ?? 0.1;
    return faturamento * aliq;
  };

  const calcLucroPresumido = (faturamento, tipo) => {
    // base de presunção
    const basePercent = tipo === 'Servicos' ? 0.32 : 0.08;
    const base = faturamento * basePercent;
    const irpj = base * 0.15;
    const csll = base * 0.09;
    const pisCofins = faturamento * 0.0365;
    return irpj + csll + pisCofins;
  };

  const calcLucroReal = (faturamento, lucroPercentInformado) => {
    const lucro = faturamento * (lucroPercentInformado / 100);
    const irpj = lucro * 0.15;
    const adicional = lucro > 240000 ? (lucro - 240000) * 0.1 : 0;
    const csll = lucro * 0.09;
    const pisCofins = faturamento * 0.0925;
    return irpj + adicional + csll + pisCofins;
  };

  // Geração das 4 empresas com dados tributários coerentes
  const [incidents, setIncidents] = useState(() => {
    const base = [
      {
        id: 1,
        name: 'Aldeota',
        local: 'Shopping Center',
        regime: 'Simples Nacional',
        tipoAtividade: 'Comercio',
        crimeNarrativa: 'Possível sonegação em empresa do Simples Nacional',
        lat: -3.735,
        lng: -38.497,
        video: 'https://videos.pexels.com/video-files/3252569/3252569-sd_640_360_25fps.mp4'
      },
      {
        id: 2,
        name: 'Centro',
        local: 'Rua das Lojas',
        regime: 'Lucro Presumido',
        tipoAtividade: 'Servicos',
        crimeNarrativa: 'Base de cálculo presumida incompatível com o faturamento declarado',
        lat: -3.725,
        lng: -38.526,
        video: '/videos/videoFabrica.mp4'
      },
      {
        id: 3,
        name: 'Barra do Ceará',
        local: 'Fábrica Têxtil',
        regime: 'Lucro Real',
        tipoAtividade: 'Industria',
        crimeNarrativa: 'Lucro real declarado muito abaixo da média do setor',
        lat: -3.705,
        lng: -38.575,
        video: 'https://videos.pexels.com/video-files/5527788/5527788-sd_640_360_25fps.mp4'
      },
      {
        id: 4,
        name: 'Mucuripe',
        local: 'Terminal Portuário',
        regime: 'Lucro Real',
        tipoAtividade: 'Servicos',
        crimeNarrativa: 'Indícios de recolhimento a menor de PIS/COFINS sobre operações portuárias',
        lat: -3.718,
        lng: -38.475,
        video: 'https://videos.pexels.com/video-files/2960682/2960682-sd_640_360_25fps.mp4'
      }
    ];

    // Gera faturamento, imposto devido e imposto pago (correto ou não) para cada empresa
    return base.map((b, index) => {
      const faturamento =
        b.regime === 'Simples Nacional'
          ? getRandomInt(300_000, 4_500_000)
          : getRandomInt(2_000_000, 25_000_000);

      let impostoDevido = 0;
      let lucroPercentInformado = null;

      if (b.regime === 'Simples Nacional') {
        impostoDevido = calcSimples(faturamento, b.tipoAtividade);
      } else if (b.regime === 'Lucro Presumido') {
        impostoDevido = calcLucroPresumido(faturamento, b.tipoAtividade);
      } else {
        // Lucro Real
        const lucroPercentReal = getRandomInt(8, 25); // margem real
        lucroPercentInformado = lucroPercentReal;
        impostoDevido = calcLucroReal(faturamento, lucroPercentInformado);
      }

      // Decide se a empresa paga o valor exato ou a menos
      // 50% de chance de pagar exatamente o devido, 50% de pagar a menos
      const pagaExato = Math.random() < 0.5;

      let impostoPago;
      if (pagaExato) {
        impostoPago = impostoDevido; // paga exatamente o que deve
      } else {
        // paga algo abaixo do devido (entre 50% e 95% do valor correto)
        const variacao = 0.5 + Math.random() * 0.45; // 0.50 a 0.95
        impostoPago = impostoDevido * variacao;
      }

      // Regra do jogo: se pagou menos que o devido, é irregular
      const isGuilty = impostoPago < impostoDevido;

      return {
        ...b,
        faturamento,
        regime: b.regime,
        tipoAtividade: b.tipoAtividade,
        crime: b.crimeNarrativa,
        impostoDevido,
        impostoPago,
        lucroPercentInformado,
        isGuilty,
        punishment:
          b.regime === 'Simples Nacional'
            ? 'AUTO DE INFRAÇÃO, MULTA E POSSÍVEL EXCLUSÃO DO SIMPLES'
            : b.regime === 'Lucro Presumido'
            ? 'RELANÇAMENTO DO IRPJ/CSLL E MULTA SOBRE A DIFERENÇA DEVIDA'
            : 'LANÇAMENTO DE OFÍCIO SOBRE IRPJ, CSLL E PIS/COFINS',
        status: 'pending'
      };
    });
  });

  const pendingCount = useMemo(
    () => incidents.filter(i => i.status === 'pending').length,
    [incidents]
  );

  const handleDecision = (type) => {
    if (!selected) return;

    const isCorrect =
      (type === 'multa' && selected.isGuilty) ||
      (type === 'aprovado' && !selected.isGuilty);

    if (isCorrect) {
      setBudget(prev => prev + 5000);
      setCorrectDecisions(prev => prev + 1);
    } else {
      setBudget(prev => prev - 10000);
    }

    let logMsg = '';
    if (type === 'multa') {
      logMsg = selected.isGuilty
        ? `SUCESSO: ${selected.name} autuada corretamente. Regime: ${selected.regime}.`
        : `ERRO: ${selected.name} estava com o imposto dentro da faixa esperada. Autuação indevida.`;
    } else {
      logMsg = !selected.isGuilty
        ? `DECISÃO ACERTADA: ${selected.name} considerada regular. Tributos compatíveis com o regime ${selected.regime}.`
        : `FALHA: ${selected.name} foi liberada, mas a análise posterior apontou diferença relevante entre imposto devido e pago.`;
    }

    const updated = incidents.map(inc =>
      inc.id === selected.id ? { ...inc, status: 'decidido', lastDecisionCorrect: isCorrect } : inc
    );
    setIncidents(updated);
    setHistory(prev => [{ text: logMsg, success: isCorrect }, ...prev]);
    setSelected(null);
  };

  React.useEffect(() => {
    if (pendingCount === 0) {
      onEndGame({
        correct: correctDecisions,
        total: TOTAL_EMPRESAS,
        budgetFinal: budget
      });
    }
  }, [pendingCount, correctDecisions, budget, onEndGame]);

  const RulesPanel = ({ onClose }) => {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}
      >
        <div
          style={{
            width: 'min(800px, 95vw)',
            maxHeight: '90vh',
            background: '#020617',
            borderRadius: 8,
            border: '1px solid #4b5563',
            padding: 20,
            overflowY: 'auto',
            color: '#e5e7eb',
            fontFamily: 'system-ui, sans-serif',
            fontSize: 13,
            lineHeight: 1.5
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>Livro de Regras – Regimes Tributários</h2>
            <button
              onClick={onClose}
              style={{
                padding: '4px 8px',
                borderRadius: 4,
                border: '1px solid #4b5563',
                background: '#111827',
                color: '#e5e7eb',
                fontSize: 11,
                cursor: 'pointer'
              }}
            >
              Fechar
            </button>
          </div>

          <p style={{ color: '#9ca3af', marginBottom: 16 }}>
            Use este resumo como referência rápida para calcular quanto cada empresa deveria pagar em impostos
            e comparar com o valor que ela efetivamente pagou no jogo.
          </p>

          <h3 style={{ marginTop: 10, marginBottom: 6, fontSize: 15 }}>1. Simples Nacional</h3>
          <ul style={{ paddingLeft: 18, marginTop: 4, marginBottom: 10 }}>
            <li>Voltado para micro e pequenas empresas (até ~R$ 4,8 milhões de faturamento anual).</li>
            <li>Pagamento unificado em uma guia (DAS), que já inclui vários tributos.</li>
            <li>No jogo, o imposto devido é uma porcentagem fixa sobre o faturamento bruto, conforme a atividade:</li>
          </ul>
          <ul style={{ paddingLeft: 30, marginTop: 0, marginBottom: 10, color: '#cbd5f5' }}>
            <li>Comércio: 8% do faturamento.</li>
            <li>Serviços: 12% do faturamento.</li>
            <li>Indústria: 10% do faturamento.</li>
          </ul>
          <p style={{ marginBottom: 10 }}>
            Exemplo: uma empresa de comércio no Simples com faturamento de R$ 1.000.000 deve pagar exatamente
            R$ 80.000 em impostos no ano. No jogo, se ela pagar menos do que isso, é tratada como irregular;
            se pagar exatamente esse valor, é considerada regular.
          </p>

          <h3 style={{ marginTop: 12, marginBottom: 6, fontSize: 15 }}>2. Lucro Presumido</h3>
          <ul style={{ paddingLeft: 18, marginTop: 4, marginBottom: 10 }}>
            <li>Usado por empresas até ~R$ 78 milhões de faturamento anual.</li>
            <li>O lucro tributável é “presumido” como um percentual fixo da receita, dependendo da atividade.</li>
          </ul>
          <ul style={{ paddingLeft: 30, marginTop: 0, marginBottom: 10, color: '#cbd5f5' }}>
            <li>Comércio/Indústria: 8% do faturamento é considerado lucro.</li>
            <li>Serviços: 32% do faturamento é considerado lucro.</li>
          </ul>
          <p style={{ marginBottom: 6 }}>
            No jogo, o imposto devido no Lucro Presumido é calculado assim:
          </p>
          <ul style={{ paddingLeft: 30, marginTop: 0, marginBottom: 10 }}>
            <li>IRPJ: 15% sobre o lucro presumido.</li>
            <li>CSLL: 9% sobre o lucro presumido.</li>
            <li>PIS/COFINS: 3,65% sobre o faturamento bruto.</li>
          </ul>
          <p style={{ marginBottom: 10 }}>
            Exemplo: uma empresa de serviços no Lucro Presumido com faturamento de R$ 2.000.000:
            primeiro calcula 32% de lucro presumido, depois aplica IRPJ + CSLL sobre essa base
            e soma PIS/COFINS sobre o faturamento. O valor final obtido é o imposto que ela
            deveria pagar. No jogo, se o valor pago for menor que esse cálculo, a empresa é
            considerada irregular; se for exatamente igual, é considerada regular.
          </p>

          <h3 style={{ marginTop: 12, marginBottom: 6, fontSize: 15 }}>3. Lucro Real</h3>
          <ul style={{ paddingLeft: 18, marginTop: 4, marginBottom: 10 }}>
            <li>Usado (e muitas vezes obrigatório) para empresas maiores ou com atividades específicas.</li>
            <li>O imposto incide sobre o lucro efetivo (lucro contábil ajustado) da empresa.</li>
          </ul>
          <p style={{ marginBottom: 6 }}>
            No jogo, a empresa informa uma margem de lucro sobre o faturamento (por exemplo:
            10%, 18%, 25%). Em cima desse lucro aplicamos:
          </p>
          <ul style={{ paddingLeft: 30, marginTop: 0, marginBottom: 10, color: '#cbd5f5' }}>
            <li>IRPJ: 15% sobre o lucro, mais um adicional de 10% sobre a parte do lucro que exceder um limite.</li>
            <li>CSLL: 9% sobre o lucro.</li>
            <li>PIS/COFINS: cerca de 9,25% sobre o faturamento bruto.</li>
          </ul>
          <p style={{ marginBottom: 10 }}>
            Somando todos esses valores, você encontra o imposto total devido no Lucro Real.
            No jogo, se a empresa pagar menos do que esse total, ela é tratada como irregular;
            se pagar exatamente esse total, é tratada como regular.
          </p>

          <h3 style={{ marginTop: 12, marginBottom: 6, fontSize: 15 }}>4. Como usar estas regras no jogo</h3>
          <ul style={{ paddingLeft: 18, marginTop: 4, marginBottom: 10 }}>
            <li>
              Sempre observe: <strong>regime</strong>, <strong>tipo de atividade</strong>,
              <strong> faturamento anual</strong> e o <strong>valor total de tributos pagos</strong>
              mostrado na tela.
            </li>
            <li>
              Use as fórmulas acima para estimar quanto a empresa deveria pagar. No jogo, a lógica é simples:
              se ela pagou menos do que o valor devido, há inconformidade; se pagou exatamente o valor devido,
              a situação é considerada regular.
            </li>
            <li>
              Pequenas diferenças podem existir na vida real, mas neste simulador a regra é objetiva para fins de
              treinamento: abaixo do devido = problema; igual ao devido = ok.
            </li>
          </ul>

          <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 12 }}>
            Este material é uma simplificação das regras tributárias reais, adaptada para fins de jogo.
            O objetivo é treinar o raciocínio: regime + atividade + faturamento = imposto devido.
            Compare sempre esse valor com o imposto que a empresa declarou ter pago.
          </p>
        </div>
      </div>
    );
  };


  return (
    <div style={{ display: 'flex', height: '100%', background: '#0a0a0a', color: '#e0e0e0', fontFamily: 'Courier New, monospace' }}>
      {/* MAPA */}
      <div style={{ flex: 2, position: 'relative', borderRight: '2px solid #333', zIndex: 0 }}>
        <MapContainer
          center={[-3.7319, -38.5267]}
          zoom={12}
          style={{ height: '100%', width: '100%', background: '#111' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {incidents.map(inc => (
            inc.status === 'pending' && (
              <CircleMarker
                key={inc.id}
                center={[inc.lat, inc.lng]}
                pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.5 }}
                radius={10}
                eventHandlers={{ click: () => setSelected(inc) }}
              >
                <Popup><strong>{inc.name}</strong></Popup>
              </CircleMarker>
            )
          ))}
        </MapContainer>

        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          background: 'rgba(0,0,0,0.8)',
          padding: '10px 15px',
          border: '1px solid #444',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          zIndex: 1000,
          fontSize: 11
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Radio size={14} className="blink" color="#22c55e" />
            <span style={{ fontWeight: 'bold' }}>Rota Fiscal – Fortaleza</span>
          </div>
          <div>Orçamento: R$ {budget.toLocaleString()}</div>
          <div>Casos restantes: {pendingCount}/{TOTAL_EMPRESAS}</div>
          <div>Volume: {(volume * 100).toFixed(0)}%</div>
        </div>
      </div>

      {/* PAINEL LATERAL */}
      <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 20, background: '#111', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#9ca3af' }}>
            Use o mapa para selecionar as empresas e decidir sobre a situação tributária.
          </span>
          <button
            onClick={() => setShowRules(true)}
            style={{
              padding: '6px 10px',
              borderRadius: 4,
              border: '1px solid #4b5563',
              background: '#111827',
              color: '#e5e7eb',
              fontSize: 11,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Info size={14} />
            Livro de Regras
          </button>
        </div>
        <div style={{ flex: 1, border: '1px solid #333', borderRadius: 4, padding: 20, background: '#1a1a1a', display: 'flex', flexDirection: 'column' }}>
          {selected ? (
            <>
              <div style={{ borderBottom: '1px solid #333', paddingBottom: 15, marginBottom: 15 }}>
                <h2 style={{ color: '#facc15', margin: 0, fontSize: 22 }}>{selected.name.toUpperCase()}</h2>
                <h3 style={{ color: '#aaa', margin: '5px 0 0 0', fontSize: 13 }}>{selected.local}</h3>
                <p style={{ margin: '8px 0 0 0', fontSize: 11, color: '#9ca3af' }}>
                  Regime: <strong>{selected.regime}</strong> • Atividade: <strong>{selected.tipoAtividade}</strong>
                </p>
              </div>

              <div style={{ background: '#000', height: 180, border: '2px solid #333', position: 'relative', overflow: 'hidden' }}>
                <video
                  key={selected.id}
                  src={selected.video}
                  autoPlay
                  muted
                  loop
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                />
                <div style={{ position: 'absolute', top: 10, left: 10, color: 'red', fontWeight: 'bold', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, background: 'red', borderRadius: '50%' }} className="blink" />
                  REC
                </div>
                <div style={{ position: 'absolute', bottom: 10, right: 10, color: 'white', fontSize: 10, fontFamily: 'monospace' }}>
                  CAM-0{selected.id}
                </div>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.5) 50%)',
                  backgroundSize: '100% 4px',
                  pointerEvents: 'none',
                  opacity: 0.3
                }} />
              </div>

              <div style={{ padding: 15, fontSize: 12, color: '#aaa', lineHeight: 1.5, flex: 1 }}>
                <p>Auditoria em andamento.</p>
                <p>Indício principal: <strong style={{ color: '#fff' }}>{selected.crime}</strong>.</p>
                <p style={{ marginTop: 6 }}>
                  Faturamento anual declarado: <strong>R$ {selected.faturamento.toLocaleString()}</strong>
                </p>
                <p>
                  Valor total de tributos pagos no ano (regime informado):{' '}
                  <strong>R$ {Math.round(selected.impostoPago).toLocaleString()}</strong>
                </p>
                {selected.regime === 'Lucro Real' && selected.lucroPercentInformado != null && (
                  <p>
                    Margem de lucro declarada: <strong>{selected.lucroPercentInformado}%</strong> sobre o faturamento.
                  </p>
                )}
                <p style={{ marginTop: 10, color: '#facc15' }}>* DECISÃO REQUERIDA *</p>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
                <button
                  onClick={() => handleDecision('multa')}
                  style={{
                    flex: 1,
                    padding: 15,
                    background: '#450a0a',
                    color: '#fecaca',
                    border: '1px solid #dc2626',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  <Siren size={18} /> APLICAR AUTUAÇÃO
                </button>
                <button
                  onClick={() => handleDecision('aprovado')}
                  style={{
                    flex: 1,
                    padding: 15,
                    background: '#052e16',
                    color: '#bbf7d0',
                    border: '1px solid #16a34a',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  <CheckCircle size={18} /> CONSIDERAR REGULAR
                </button>
              </div>
            </>
          ) : (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#444'
            }}>
              <Crosshair size={64} style={{ marginBottom: 20, opacity: 0.5, color: '#ef4444' }} />
              <p style={{ letterSpacing: 2, textAlign: 'center' }}>
                SELECIONE UM PONTO NO MAPA<br />PARA INICIAR A AUDITORIA
              </p>
            </div>
          )}
        </div>

        <div style={{ height: 180, background: '#000', border: '1px solid #333', padding: 12, overflowY: 'auto', fontSize: 11 }}>
          <div style={{ color: '#22c55e' }}>
            [SISTEMA] RotaFiscal online. Casos pendentes: {pendingCount}. Orçamento atual: R$ {budget}.
          </div>
          {history.map((log, i) => (
            <div
              key={i}
              style={{
                marginTop: 6,
                color: log.success ? '#4ade80' : '#ef4444',
                borderBottom: '1px solid #111',
                paddingBottom: 2
              }}
            >
              {log.text}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .blink { animation: blinker 1s linear infinite; }
        @keyframes blinker { 50% { opacity: 0; } }
        `}</style>

        {showRules && <RulesPanel onClose={() => setShowRules(false)} />}
    </div>
  );
};

// funçõezinhas auxiliares no mesmo arquivo
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// ------------------- TELA DE RESULTADOS -------------------

const ResultsScreen = ({ data, onRestart, onExit }) => {
  const { correct, total, budgetFinal } = data;

  let title, description, icon, color;

  if (correct === total) {
    // melhor cenário
    title = 'Promoção para Auditor-Chefe';
    description =
      'Sua atuação foi impecável. Todas as empresas foram avaliadas com precisão, sem injustiças nem omissões. ' +
      'O relatório final da rota de Fortaleza foi usado como exemplo em treinamentos internos e seu nome foi ' +
      'indicado para assumir uma coordenação de fiscalização estratégica na superintendência.';
    icon = <Award size={36} />;
    color = '#22c55e';
  } else if (correct >= Math.ceil(total / 2)) {
    // cenário mediano
    title = 'Você continua na função, sob observação';
    description =
      'Você acertou parte das análises, mas deixou escapar inconsistências importantes e cometeu alguns excessos. ' +
      'Seu desempenho foi considerado mediano: suficiente para permanecer na equipe, mas longe do padrão de excelência ' +
      'esperado para promoções. Seu nome entra no radar da chefia, mas com um asterisco.';
    icon = <AlertTriangle size={36} />;
    color = '#f97316';
  } else {
    // pior cenário
    title = 'Exoneração do cargo de auditor';
    description =
      'As decisões tomadas ao longo da rota comprometeram a credibilidade da fiscalização. Empresas irregulares ' +
      'foram liberadas, enquanto contribuintes em situação regular sofreram autuações injustas. Após análise da ' +
      'corregedoria, sua permanência na Receita Federal foi considerada incompatível com a função.';
    icon = <ThumbsDown size={36} />;
    color = '#ef4444';
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#020617',
      color: '#e5e7eb',
      padding: 20
    }}>
      <div style={{
        maxWidth: 680,
        width: '100%',
        borderRadius: 10,
        border: '1px solid #374151',
        background: '#020617',
        padding: 24
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            border: `2px solid ${color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color
          }}>
            {icon}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20 }}>{title}</h2>
            <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>
              Resultado final da rota fiscal em Fortaleza
            </p>
          </div>
        </div>

        <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
          <p>{description}</p>
        </div>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 20,
          fontSize: 13
        }}>
          <Stat label="Decisões corretas" value={`${correct} de ${total}`} />
          <Stat label="Orçamento final" value={`R$ ${budgetFinal.toLocaleString()}`} />
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onExit}
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              border: '1px solid #b91c1c',
              background: '#450a0a',
              color: '#fecaca',
              cursor: 'pointer',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            Sair do jogo
          </button>
          <button
            onClick={onRestart}
            style={{
              padding: '8px 14px',
              borderRadius: 6,
              border: '1px solid #22c55e',
              background: '#022c22',
              color: '#bbf7d0',
              cursor: 'pointer',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            Jogar novamente
          </button>
        </div>
      </div>
    </div>
  );
};

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

export default App;
