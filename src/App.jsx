import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, Siren, CheckCircle, Radio, DollarSign, Crosshair, MonitorPlay } from 'lucide-react';

const DispatchGame = () => {
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]); 
  const [budget, setBudget] = useState(100000); // Dinheiro do departamento

  // DADOS COM CULPA E PUNIÇÕES
  const [incidents, setIncidents] = useState([
    { 
      id: 1, 
      name: "Aldeota", 
      local: "Shopping Center", 
      crime: "Sonegação", 
      lat: -3.735, lng: -38.497, status: 'pending',
      video: "https://videos.pexels.com/video-files/3252569/3252569-sd_640_360_25fps.mp4",
      isGuilty: true, // É culpado?
      punishment: "MULTA DE R$ 200.000 E INTERDIÇÃO DA LOJA" // A Punição
    },
    { 
      id: 2, 
      name: "Centro", 
      local: "Rua das Lojas", 
      crime: "Sem Nota", 
      lat: -3.725, lng: -38.526, status: 'pending',
      video: "/videos/videoFabrica.mp4",
      isGuilty: true,
      punishment: "APREENSÃO DE MERCADORIA E PRISÃO DO GERENTE"
    },
    { 
      id: 3, 
      name: "Barra do Ceará", 
      local: "Fábrica Têxtil", 
      crime: "Irregular", 
      lat: -3.705, lng: -38.575, status: 'pending',
      video: "https://videos.pexels.com/video-files/5527788/5527788-sd_640_360_25fps.mp4",
      isGuilty: false, // Inocente (se multar, perde ponto)
      punishment: "NENHUMA (ERRO OPERACIONAL)"
    },
    { 
      id: 4, 
      name: "Mucuripe", 
      local: "Porto", 
      crime: "Contrabando", 
      lat: -3.718, lng: -38.475, status: 'pending',
      video: "https://videos.pexels.com/video-files/2960682/2960682-sd_640_360_25fps.mp4",
      isGuilty: true,
      punishment: "BLOQUEIO DE CNPJ E CONFISCO DE CARGA"
    }
  ]);

  const handleDecision = (type) => {
    if (!selected) return;

    // LÓGICA DE ACERTO/ERRO
    const isCorrect = (type === 'multa' && selected.isGuilty) || (type === 'aprovado' && !selected.isGuilty);
    
    // Atualiza saldo
    if (isCorrect) setBudget(prev => prev + 5000);
    else setBudget(prev => prev - 10000);

    // Mensagem do Log
    let logMsg = "";
    if (type === 'multa') {
        logMsg = selected.isGuilty 
            ? `SUCESSO: ${selected.name} punido. Pena: ${selected.punishment}.`
            : `ERRO: ${selected.name} processou o estado! Era inocente.`;
    } else {
        logMsg = !selected.isGuilty
            ? `CORRETO: ${selected.name} liberado. Nenhuma irregularidade.`
            : `FALHA: ${selected.name} escapou! Sonegação confirmada.`;
    }

    const updated = incidents.map(inc => inc.id === selected.id ? { ...inc, status: type } : inc);
    setIncidents(updated);
    
    setHistory(prev => [{ text: logMsg, success: isCorrect }, ...prev]);
    setSelected(null);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0a0a0a', color: '#e0e0e0', fontFamily: 'Courier New, monospace' }}>
      
      {/* --- 1. MAPA INTERATIVO (Esquerda) --- */}
      <div style={{ flex: 2, position: 'relative', borderRight: '2px solid #333', zIndex: 0 }}>
        <MapContainer 
          center={[-3.7319, -38.5267]} 
          zoom={12} 
          style={{ height: "100%", width: "100%", background: '#111' }}
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

        <div style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(0,0,0,0.8)', padding: '10px 15px', border: '1px solid #444', display: 'flex', alignItems: 'center', gap: 10, zIndex: 1000 }}>
           <Radio size={16} className="blink" color="#ef4444"/> 
           <span style={{ fontWeight: 'bold' }}>ORÇAMENTO: R$ {budget.toLocaleString()}</span>
        </div>
      </div>

      {/* --- 2. PAINEL DE CONTROLE (Direita) --- */}
      <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 20, background: '#111', zIndex: 10 }}>
        
        <div style={{ flex: 1, border: '1px solid #333', borderRadius: 4, padding: 20, background: '#1a1a1a', display: 'flex', flexDirection: 'column' }}>
          {selected ? (
            <>
              <div style={{ borderBottom: '1px solid #333', paddingBottom: 15, marginBottom: 15 }}>
                <h2 style={{ color: '#facc15', margin: 0, fontSize: 24 }}>{selected.name.toUpperCase()}</h2>
                <h3 style={{ color: '#aaa', margin: '5px 0 0 0', fontSize: 14 }}>{selected.local}</h3>
              </div>
              
              {/* PLAYER DE VÍDEO */}
              <div style={{ background: '#000', height: 200, border: '2px solid #333', position: 'relative', overflow: 'hidden' }}>
                <video 
                  key={selected.id} 
                  src={selected.video} 
                  autoPlay muted loop 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                />
                <div style={{ position: 'absolute', top: 10, left: 10, color: 'red', fontWeight: 'bold', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, background: 'red', borderRadius: '50%' }} className="blink"></div> REC
                </div>
                <div style={{ position: 'absolute', bottom: 10, right: 10, color: 'white', fontSize: 10, fontFamily: 'monospace' }}>CAM-0{selected.id}</div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.5) 50%)', backgroundSize: '100% 4px', pointerEvents: 'none', opacity: 0.3 }}></div>
              </div>

              <div style={{ padding: 15, fontSize: 12, color: '#aaa', lineHeight: 1.5, flex: 1 }}>
                <p>> Auditoria em andamento.</p>
                <p>> Denúncia: <strong style={{color: '#fff'}}>{selected.crime}</strong>.</p>
                <p style={{marginTop: 10, color: '#facc15'}}>* DECISÃO REQUERIDA *</p>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', gap: 10 }}>
                <button onClick={() => handleDecision('multa')} style={{ flex: 1, padding: 15, background: '#450a0a', color: '#fecaca', border: '1px solid #dc2626', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Siren size={18}/> APLICAR PENA
                </button>
                <button onClick={() => handleDecision('aprovado')} style={{ flex: 1, padding: 15, background: '#052e16', color: '#bbf7d0', border: '1px solid #16a34a', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <CheckCircle size={18}/> INOCENTAR
                </button>
              </div>
            </>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
              <Crosshair size={64} style={{ marginBottom: 20, opacity: 0.5, color: '#ef4444' }}/>
              <p style={{letterSpacing: 2, textAlign:'center'}}>SELECIONE UM ALVO<br/>PARA AUDITORIA</p>
            </div>
          )}
        </div>

        {/* LOG COLORIDO */}
        <div style={{ height: 180, background: '#000', border: '1px solid #333', padding: 12, overflowY: 'auto', fontSize: 11 }}>
          <div style={{ color: '#22c55e' }}>[SISTEMA] RotaFiscal Online. Orçamento: R$ {budget}</div>
          {history.map((log, i) => (
            <div key={i} style={{ marginTop: 6, color: log.success ? '#4ade80' : '#ef4444', borderBottom: '1px solid #111', paddingBottom: 2 }}>
                {log.text}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .blink { animation: blinker 1s linear infinite; }
        @keyframes blinker { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
};

export default DispatchGame;