"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
// Adicionei Volume2 e VolumeX nos imports
import { Siren, CheckCircle, Info, Terminal, XCircle, Crosshair, Activity, AlertTriangle, Database, Volume2, VolumeX } from "lucide-react"
import RulesPanel from "../components/RulesPanel"
import { TOTAL_EMPRESAS, getRandomInt, calcSimples, calcLucroPresumido, calcLucroReal } from "../utils/taxLogic"

// IMPORTAÇÃO DA MÚSICA
import gameMusicFile from "../assets/game_music.mp3"

// --- NOVA PALETA DE CORES (TEMA ÂMBAR/SÉRIO) ---
const COLORS = {
  primary: "#fbbf24", // Âmbar/Dourado (cor principal de destaque)
  secondary: "#d97706", // Âmbar mais escuro
  accent: "#f59e0b", // Laranja de alerta
  danger: "#ef4444", // Vermelho (erro/multa)
  success: "#10b981", // Verde (sucesso)
  background: "#0c0a09", // Preto "quente" (fundo principal)
  surface: "#1c1917", // Cinza chumbo muito escuro (painéis)
  surfaceLight: "#292524", // Cinza chumbo um pouco mais claro (hover/cartões)
  border: "#44403c", // Cinza quente para bordas
  textPrimary: "#fafaf9", // Branco quente (quase bege claro)
  textSecondary: "#a8a29e", // Cinza médio para textos secundários
  glow: "rgba(251, 191, 36, 0.3)", // Brilho dourado suave
}

// Componente para mover o mapa suavemente
function MapRecenter({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, 14, { animate: true, duration: 1.5 })
  }, [center, map])
  return null
}

const GameScreen = ({ volume, onEndGame }) => {
  const [selected, setSelected] = useState(null)
  const [history, setHistory] = useState([])
  const [budget, setBudget] = useState(100000)
  const [correctDecisions, setCorrectDecisions] = useState(0)
  const [showRules, setShowRules] = useState(false)
  
  // --- CONFIGURAÇÃO DE ÁUDIO ---
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef(new Audio(gameMusicFile))

  useEffect(() => {
    const audio = audioRef.current
    audio.loop = true
    // Usa o volume passado via props (do menu) ou 0.5 padrão
    audio.volume = volume !== undefined ? volume : 0.5 

    // Tenta tocar ao iniciar
    const playPromise = audio.play()
    
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Se o navegador bloquear o autoplay, a gente muta o estado visual
        console.log("Autoplay bloqueado pelo navegador")
        setIsMuted(true)
      })
    }

    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, []) // Executa apenas uma vez ao montar

  // Atualiza volume se a prop mudar
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume !== undefined ? volume : 0.5
    }
  }, [volume])

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.play()
      setIsMuted(false)
    } else {
      audioRef.current.pause()
      setIsMuted(true)
    }
  }

  // --- GERAÇÃO DOS DADOS ---
  const [incidents, setIncidents] = useState(() => {
    const base = [
      { id: 1, name: "Aldeota Corp", local: "Setor Comercial Norte", regime: "Simples Nacional", tipoAtividade: "Comercio", crimeNarrativa: "Possível sonegação no Simples", lat: -3.735, lng: -38.497, video: "https://videos.pexels.com/video-files/3252569/3252569-sd_640_360_25fps.mp4" },
      { id: 2, name: "Centro Facções", local: "Distrito Industrial", regime: "Lucro Presumido", tipoAtividade: "Servicos", crimeNarrativa: "Base presumida incompatível", lat: -3.725, lng: -38.526, video: "/videos/videoFabrica.mp4" },
      { id: 3, name: "Barra Têxtil", local: "Zona Portuária", regime: "Lucro Real", tipoAtividade: "Industria", crimeNarrativa: "Lucro real abaixo da média", lat: -3.705, lng: -38.575, video: "https://videos.pexels.com/video-files/5527788/5527788-sd_640_360_25fps.mp4" },
      { id: 4, name: "Mucuripe Logs", local: "Terminal de Cargas", regime: "Lucro Real", tipoAtividade: "Servicos", crimeNarrativa: "Indícios PIS/COFINS incorretos", lat: -3.718, lng: -38.475, video: "https://videos.pexels.com/video-files/2960682/2960682-sd_640_360_25fps.mp4" },
    ]
    return base.map((b) => {
      const faturamento = b.regime === "Simples Nacional" ? getRandomInt(300000, 4500000) : getRandomInt(2000000, 25000000)
      let impostoDevido = 0
      let lucroPercentInformado = null
      if (b.regime === "Simples Nacional") impostoDevido = calcSimples(faturamento, b.tipoAtividade)
      else if (b.regime === "Lucro Presumido") impostoDevido = calcLucroPresumido(faturamento, b.tipoAtividade)
      else {
        lucroPercentInformado = getRandomInt(8, 25)
        impostoDevido = calcLucroReal(faturamento, lucroPercentInformado)
      }
      const pagaExato = Math.random() < 0.5
      const impostoPago = pagaExato ? impostoDevido : impostoDevido * (0.5 + Math.random() * 0.45)
      const isGuilty = impostoPago < impostoDevido
      return { ...b, faturamento, impostoDevido, impostoPago, lucroPercentInformado, isGuilty, status: "pending", crime: b.crimeNarrativa }
    })
  })

  const pendingCount = useMemo(() => incidents.filter((i) => i.status === "pending").length, [incidents])
  const pendingIncidents = useMemo(() => incidents.filter((i) => i.status === "pending"), [incidents])

  const handleDecision = (type) => {
    if (!selected) return
    const isCorrect = (type === "multa" && selected.isGuilty) || (type === "aprovado" && !selected.isGuilty)
    if (isCorrect) {
      setBudget((prev) => prev + 5000)
      setCorrectDecisions((prev) => prev + 1)
    } else {
      setBudget((prev) => prev - 10000)
    }
    const logMsg = isCorrect ? `Análise de ${selected.name} correta.` : `Falha na análise de ${selected.name}.`
    const updated = incidents.map((inc) => (inc.id === selected.id ? { ...inc, status: "decidido" } : inc))
    setIncidents(updated)
    setHistory((prev) => [{ text: logMsg, success: isCorrect, id: Date.now() }, ...prev.slice(0, 4)])
    setSelected(null)
  }

  useEffect(() => {
    if (pendingCount === 0) {
      setTimeout(() => {
        onEndGame({ correct: correctDecisions, total: TOTAL_EMPRESAS, budgetFinal: budget })
      }, 1500)
    }
  }, [pendingCount, correctDecisions, budget, onEndGame])

  const getCardStyle = (incId) => {
    const isSelected = selected && selected.id === incId
    return {
      background: isSelected ? COLORS.surfaceLight : COLORS.surface,
      border: isSelected ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.border}`,
      borderRadius: "6px",
      minWidth: "200px",
      height: "90px",
      padding: "12px",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      textAlign: "left",
      transition: "all 0.2s ease",
      fontFamily: "system-ui, -apple-system, sans-serif",
      boxShadow: isSelected ? `0 0 15px ${COLORS.glow}` : "none",
      transform: isSelected ? "translateY(-2px)" : "none",
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        background: COLORS.background,
        color: COLORS.textPrimary,
        fontFamily: "system-ui, -apple-system, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 9999,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px)",
          opacity: 0.2,
        }}
      />

      {/* --- BARRA SUPERIOR --- */}
      <div
        style={{
          height: "70px",
          background: COLORS.surface,
          borderBottom: `2px solid ${COLORS.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px",
          boxShadow: `0 4px 6px rgba(0,0,0,0.1)`,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, borderRight: `1px solid ${COLORS.border}`, paddingRight: 24 }}>
            <Database size={20} color={COLORS.primary} />
            <span style={{ fontWeight: 700, letterSpacing: 1, fontSize: 16, color: COLORS.primary, textTransform: "uppercase" }}>
              Rota Fiscal <span style={{color: COLORS.textSecondary, fontSize: 14}}>| Terminal v2.5</span>
            </span>
          </div>

          <div style={{ display: "flex", gap: 24, fontSize: 14, fontWeight: 500 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Activity size={16} color={COLORS.primary} />
              <span style={{ color: COLORS.textSecondary }}>Orçamento:</span>
              <span style={{ color: COLORS.textPrimary, fontWeight: 600 }}>R$ {budget.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Crosshair size={16} color={COLORS.accent} />
              <span style={{ color: COLORS.textSecondary }}>Pendentes:</span>
              <span style={{ color: COLORS.textPrimary, fontWeight: 600 }}>{pendingCount}/{TOTAL_EMPRESAS}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {/* BOTÃO DE SOM */}
          <button
            onClick={toggleMute}
            style={{
              background: "transparent",
              border: `1px solid ${COLORS.primary}`,
              color: COLORS.primary,
              width: "36px",
              height: "36px",
              borderRadius: 4,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.primary; e.currentTarget.style.color = COLORS.background; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.primary; }}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* BOTÃO DE REGRAS */}
          <button
            onClick={() => setShowRules(true)}
            style={{
              background: "transparent",
              border: `1px solid ${COLORS.primary}`,
              color: COLORS.primary,
              padding: "0 14px",
              height: "36px",
              borderRadius: 4,
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 13, fontWeight: 600,
              transition: "all 0.2s",
              textTransform: "uppercase"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.primary; e.currentTarget.style.color = COLORS.background; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.primary; }}
          >
            <Info size={16} /> Protocolos
          </button>
        </div>
      </div>

      {/* --- ÁREA CENTRAL (MAPA + LOG) --- */}
      <div style={{ flex: 1, position: "relative", display: "flex" }}>
        <MapContainer
          center={[-3.7319, -38.5267]} zoom={13}
          style={{ height: "100%", width: "100%", background: "#000" }}
          zoomControl={false}
        >
          <TileLayer
            attribution="&copy; CARTO"
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            className="map-tiles"
          />
          <MapRecenter center={selected ? [selected.lat, selected.lng] : null} />
          {incidents.map((inc) => {
            if (inc.status !== "pending") return null
            const isSelected = selected?.id === inc.id
            return (
              <CircleMarker
                key={inc.id}
                center={[inc.lat, inc.lng]}
                pathOptions={{
                  color: isSelected ? COLORS.accent : COLORS.primary,
                  fillColor: isSelected ? COLORS.accent : COLORS.primary,
                  fillOpacity: isSelected ? 0.9 : 0.6,
                  weight: isSelected ? 3 : 2,
                }}
                radius={isSelected ? 16 : 11}
                eventHandlers={{ click: () => setSelected(inc) }}
              >
                <Popup>
                  <div style={{ fontFamily: "sans-serif", color: "#000", fontWeight: "bold" }}>{inc.name}</div>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>

        {/* LOG LATERAL */}
        <div
          style={{
            position: "absolute", top: 20, right: 20, width: 340,
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8, padding: 16,
            zIndex: 500,
            boxShadow: `0 4px 12px rgba(0,0,0,0.3)`,
          }}
        >
          <div style={{ borderBottom: `1px solid ${COLORS.border}`, marginBottom: 12, paddingBottom: 8, display: "flex", alignItems: "center", gap: 8, color: COLORS.primary }}>
            <Terminal size={16} />
            <span style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase" }}>Log do Sistema</span>
          </div>
          <div style={{ height: 120, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
            {history.map((log) => (
              <div key={log.id} style={{
                padding: "6px 8px",
                borderLeft: `3px solid ${log.success ? COLORS.success : COLORS.danger}`,
                background: COLORS.surfaceLight,
                color: COLORS.textSecondary,
                fontSize: 11, fontFamily: "monospace"
              }}>
                <strong style={{color: log.success ? COLORS.success : COLORS.danger}}>{log.success ? "[SUCESSO]" : "[FALHA]"}</strong> {log.text}
              </div>
            ))}
            {history.length === 0 && <div style={{ color: COLORS.textSecondary, textAlign: "center", padding: "20px 0", fontSize: 12, opacity: 0.7 }}>Aguardando dados...</div>}
          </div>
        </div>

        {/* MODAL DE DETALHES */}
        {selected && (
          <div style={{ position: "absolute", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ width: "700px", maxWidth: "90vw", background: COLORS.surface, border: `1px solid ${COLORS.primary}`, borderRadius: 12, boxShadow: `0 20px 60px rgba(0,0,0,0.6)`, padding: 24, position: "relative" }}>
              <button onClick={() => setSelected(null)} style={{ position: "absolute", top: -12, right: -12, background: COLORS.surface, border: `2px solid ${COLORS.danger}`, color: COLORS.danger, borderRadius: "50%", cursor: "pointer", padding: 6, display: "flex" }}>
                <XCircle size={24} />
              </button>

              <div style={{ borderBottom: `2px solid ${COLORS.border}`, paddingBottom: 16, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <AlertTriangle size={24} color={COLORS.primary} />
                  <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: COLORS.primary, textTransform: "uppercase", letterSpacing: 1 }}>{selected.name}</h2>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 13, color: COLORS.textSecondary }}>
                  <span>ID: {selected.id.toString().padStart(4, "0")} • {selected.local}</span>
                  <span style={{ color: COLORS.primary, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                    <div className="blink" style={{ width: 8, height: 8, background: COLORS.primary, borderRadius: "50%" }} /> SOB ANÁLISE
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
                <div style={{ flex: 1, border: `1px solid ${COLORS.border}`, borderRadius: 8, position: "relative", background: "#000", overflow: "hidden", height: "280px" }}>
                  <video src={selected.video} autoPlay muted loop style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9, filter: "grayscale(30%) sepia(20%)" }} />
                  <div style={{ position: "absolute", top: 12, left: 12, color: COLORS.danger, fontSize: 11, display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.8)", padding: "4px 8px", borderRadius: 4, fontWeight: 700 }}>
                    <div className="blink" style={{ width: 8, height: 8, background: COLORS.danger, borderRadius: "50%" }} /> REC • VIGILÂNCIA
                  </div>
                </div>

                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, fontSize: 14 }}>
                  <div style={{ background: COLORS.surfaceLight, padding: 14, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ color: COLORS.textSecondary, fontSize: 11, fontWeight: 600 }}>REGIME TRIBUTÁRIO</div>
                      <div style={{ color: COLORS.textPrimary, fontWeight: 700, fontSize: 15 }}>{selected.regime}</div>
                    </div>
                    <div>
                      <div style={{ color: COLORS.textSecondary, fontSize: 11, fontWeight: 600 }}>TIPO DE ATIVIDADE</div>
                      <div style={{ color: COLORS.textPrimary, fontWeight: 700, fontSize: 15 }}>{selected.tipoAtividade}</div>
                    </div>
                  </div>
                  <div style={{ background: COLORS.surfaceLight, padding: 14, borderRadius: 8, border: `1px solid ${COLORS.primary}40` }}>
                    <div style={{ color: COLORS.textSecondary, fontSize: 11, fontWeight: 600 }}>FATURAMENTO ANUAL (DECLARADO)</div>
                    <div style={{ fontSize: 24, color: COLORS.primary, fontWeight: 700 }}>R$ {selected.faturamento.toLocaleString()}</div>
                  </div>
                  <div style={{ background: COLORS.surfaceLight, padding: 14, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
                    <div style={{ color: COLORS.textSecondary, fontSize: 11, fontWeight: 600 }}>IMPOSTO PAGO (TOTAL)</div>
                    <div style={{ fontSize: 22, color: COLORS.textPrimary, fontWeight: 700 }}>R$ {Math.round(selected.impostoPago).toLocaleString()}</div>
                    {selected.lucroPercentInformado && <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 6 }}>Margem de Lucro: {selected.lucroPercentInformado}%</div>}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: 20, padding: 14, background: `${COLORS.danger}15`, borderLeft: `4px solid ${COLORS.danger}`, borderRadius: 4, fontSize: 13, display: "flex", alignItems: "center", gap: 12 }}>
                <AlertTriangle size={20} color={COLORS.danger} />
                <div>
                  <div style={{ fontWeight: 700, color: COLORS.danger, textTransform: "uppercase" }}>Alerta de Irregularidade</div>
                  <div style={{ color: COLORS.textPrimary }}>{selected.crime}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => handleDecision("multa")} style={{ flex: 1, padding: 16, background: COLORS.danger, color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700, display: "flex", justifyContent: "center", alignItems: "center", gap: 10, fontSize: 14, textTransform: "uppercase", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#dc2626"} onMouseLeave={e => e.currentTarget.style.background = COLORS.danger}>
                  <Siren size={20} /> Emitir Autuação
                </button>
                <button onClick={() => handleDecision("aprovado")} style={{ flex: 1, padding: 16, background: COLORS.success, color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700, display: "flex", justifyContent: "center", alignItems: "center", gap: 10, fontSize: 14, textTransform: "uppercase", transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#059669"} onMouseLeave={e => e.currentTarget.style.background = COLORS.success}>
                  <CheckCircle size={20} /> Aprovar Contas
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- BARRA INFERIOR --- */}
      <div
        style={{
          height: "140px",
          background: COLORS.surface,
          borderTop: `2px solid ${COLORS.border}`,
          display: "flex",
          flexDirection: "column",
          zIndex: 100,
        }}
      >
        <div style={{ 
          padding: "8px 24px", 
          background: COLORS.surfaceLight, 
          borderBottom: `1px solid ${COLORS.border}`,
          fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, textTransform: "uppercase", letterSpacing: 1, display: "flex", alignItems: "center", gap: 8
        }}>
          <Database size={14} /> Fila de Análise Prioritária
        </div>

        <div style={{ 
          flex: 1, 
          display: "flex", 
          alignItems: "center", 
          padding: "0 24px", 
          gap: 16, 
          overflowX: "auto" 
        }}>
          {pendingIncidents.length === 0 ? (
            <div style={{ flex: 1, textAlign: "center", color: COLORS.textSecondary, fontSize: 14, fontWeight: 500, opacity: 0.7 }}>
              — Todos os casos foram processados —
            </div>
          ) : (
            pendingIncidents.map((inc) => {
              const isSelected = selected?.id === inc.id
              return (
                <button key={inc.id} onClick={() => setSelected(inc)} style={getCardStyle(inc.id)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: isSelected ? COLORS.primary : COLORS.textPrimary, fontWeight: 700 }}>
                    <span>{inc.name}</span>
                    {isSelected && <div className="blink" style={{ width: 8, height: 8, background: COLORS.primary, borderRadius: "50%" }} />}
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.textSecondary }}>{inc.local}</div>
                  <div style={{ fontSize: 11, color: isSelected ? COLORS.primary : COLORS.textSecondary, borderTop: `1px solid ${COLORS.border}`, paddingTop: 6, marginTop: 6, fontWeight: 600, textTransform: "uppercase" }}>
                    {inc.regime}
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      <style>{`
        .blink { animation: blinker 2s ease-in-out infinite; }
        @keyframes blinker { 
          0%, 100% { opacity: 1; } 
          50% { opacity: 0.4; } 
        }
        .map-tiles { 
          filter: grayscale(100%) contrast(1.1) brightness(0.6) sepia(100%) hue-rotate(40deg) saturate(1.5);
        }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${COLORS.surface}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; borderRadius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${COLORS.primary}; }
      `}</style>

      {showRules && <RulesPanel onClose={() => setShowRules(false)} />}
    </div>
  )
}

export default GameScreen