"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import {
  Siren,
  CheckCircle,
  Info,
  Terminal,
  XCircle,
  AlertTriangle,
  Database,
  Volume2,
  VolumeX,
  Crosshair,
  Activity,
} from "lucide-react"
import RulesPanel from "../components/RulesPanel"
import { TOTAL_EMPRESAS, getRandomInt, calcSimples, calcLucroPresumido, calcLucroReal } from "../utils/taxLogic"

// IMPORTAÇÃO DA MÚSICA
import gameMusicFile from "../assets/game_music.mp3"

// --- PALETA DE CORES (TEMA ÂMBAR/SÉRIO - RESTAURADO) ---
const COLORS = {
  primary: "#fbbf24", // Âmbar/Dourado
  secondary: "#d97706", // Âmbar escuro
  accent: "#f59e0b", // Laranja
  danger: "#ef4444", // Vermelho
  success: "#10b981", // Verde
  background: "#0c0a09", // Preto quente
  surface: "#1c1917", // Cinza chumbo escuro
  surfaceLight: "#292524", // Cinza chumbo claro
  border: "#44403c", // Bordas cinza quente
  textPrimary: "#fafaf9", // Branco quente
  textSecondary: "#a8a29e", // Cinza médio
  glow: "0 0 15px rgba(251, 191, 36, 0.4)", // Glow Dourado
}

// Componente para mover o mapa suavemente (mantido para compatibilidade, mas o MapLibre usa ref)
function MapRecenter({ center }) {
  // Não usado com MapLibre diretamente, mas mantido caso volte para Leaflet
  return null
}

const GameScreen = ({ volume, onEndGame }) => {
  const [selected, setSelected] = useState(null)
  const [history, setHistory] = useState([])
  const [budget, setBudget] = useState(100000)
  const [correctDecisions, setCorrectDecisions] = useState(0)
  const [showRules, setShowRules] = useState(false)

  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])

  // --- CONFIGURAÇÃO DE ÁUDIO ---
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef(new Audio(gameMusicFile))

  useEffect(() => {
    const audio = audioRef.current
    audio.loop = true
    audio.volume = volume !== undefined ? volume : 0.5
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(() => setIsMuted(true))
    }
    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume !== undefined ? volume : 0.5
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

  // --- GERAÇÃO DOS DADOS (COM VÍDEOS CORRETOS) ---
  const [incidents] = useState(() => {
    const base = [
      {
        id: 1,
        name: "Aldeota Corp",
        local: "Setor Comercial Norte",
        regime: "Simples Nacional",
        tipoAtividade: "Comercio",
        crimeNarrativa: "Possível sonegação no Simples",
        lat: -3.735,
        lng: -38.497,
        video: "/videos/videoAldeota.mp4",
      },
      {
        id: 2,
        name: "Centro Confecções",
        local: "Distrito Industrial",
        regime: "Lucro Presumido",
        tipoAtividade: "Servicos",
        crimeNarrativa: "Base presumida incompatível",
        lat: -3.725,
        lng: -38.526,
        video: "/videos/videoCentro.mp4",
      },
      {
        id: 3,
        name: "Barra Têxtil",
        local: "Zona Portuária",
        regime: "Lucro Real",
        tipoAtividade: "Industria",
        crimeNarrativa: "Lucro real abaixo da média",
        lat: -3.705,
        lng: -38.575,
        video: "/videos/videoTextil.mp4",
      },
      {
        id: 4,
        name: "Mucuripe Logs",
        local: "Terminal de Cargas",
        regime: "Lucro Real",
        tipoAtividade: "Servicos",
        crimeNarrativa: "Indícios PIS/COFINS incorretos",
        lat: -3.718,
        lng: -38.475,
        video: "/videos/videoFabrica.mp4",
      },
    ]

    return base.map((b) => {
      const faturamento =
        b.regime === "Simples Nacional" ? getRandomInt(300000, 4500000) : getRandomInt(2000000, 25000000)
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

      return {
        ...b,
        faturamento,
        impostoDevido,
        impostoPago,
        lucroPercentInformado,
        isGuilty,
        status: "pending",
        crime: b.crimeNarrativa,
      }
    })
  })

  const [incidentsList, setIncidentsList] = useState(incidents)
  const pendingCount = useMemo(() => incidentsList.filter((i) => i.status === "pending").length, [incidentsList])
  const pendingIncidents = useMemo(() => incidentsList.filter((i) => i.status === "pending"), [incidentsList])

  // --- INICIALIZAÇÃO DO MAPA 3D (MAPLIBRE) ---
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [-38.5267, -3.7319],
      zoom: 16,
      pitch: 60,
      bearing: -10,
      antialias: true,
    })

    mapRef.current = map

    map.on("load", () => {
      if (map.getLayer("building")) {
        map.removeLayer("building")
      }

      map.addLayer(
        {
          id: "3d-buildings",
          source: "openmaptiles",
          "source-layer": "building",
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": [
              "interpolate",
              ["linear"],
              ["get", "render_height"],
              0, COLORS.surface,
              30, "#44403c",
              100, COLORS.secondary,
            ],
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15, 0,
              15.05, ["*", ["coalesce", ["get", "render_height"], 5], 1],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15, 0,
              15.05, ["coalesce", ["get", "render_min_height"], 0],
            ],
            "fill-extrusion-opacity": 0.9,
          },
        },
        "poi_label"
      )

      incidentsList.forEach((inc) => {
        if (inc.status !== "pending") return

        const el = document.createElement("div")
        el.style.width = "24px"
        el.style.height = "24px"
        el.style.borderRadius = "50%"
        el.style.backgroundColor = COLORS.primary
        el.style.border = `2px solid #fff`
        el.style.cursor = "pointer"
        el.style.boxShadow = `0 0 10px ${COLORS.primary}`
        
        const inner = document.createElement("div")
        inner.className = "blink"
        inner.style.width = "100%"; inner.style.height = "100%"; inner.style.borderRadius = "50%"; inner.style.backgroundColor = "white"; inner.style.opacity = "0.5";
        el.appendChild(inner)

        el.addEventListener("click", () => setSelected(inc))

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([inc.lng, inc.lat])
          .addTo(map)

        markersRef.current.push({ id: inc.id, marker })
      })
    })

    return () => {
      markersRef.current.forEach(({ marker }) => marker.remove())
      markersRef.current = []
      map.remove()
      mapRef.current = null
    }
  }, [incidentsList])

  useEffect(() => {
    if (selected && mapRef.current) {
      mapRef.current.flyTo({
        center: [selected.lng, selected.lat],
        zoom: 17,
        pitch: 60,
        bearing: 20,
        duration: 2000,
      })
    }
  }, [selected])

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
    const updated = incidentsList.map((inc) => (inc.id === selected.id ? { ...inc, status: "decidido" } : inc))
    setIncidentsList(updated)
    setHistory((prev) => [{ text: logMsg, success: isCorrect, id: Date.now() }, ...prev.slice(0, 4)])

    const markerIndex = markersRef.current.findIndex((m) => m.id === selected.id)
    if (markerIndex !== -1) {
      markersRef.current[markerIndex].marker.remove()
      markersRef.current.splice(markerIndex, 1)
    }

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
        display: "flex", flexDirection: "column", height: "100vh", width: "100vw",
        background: COLORS.background, color: COLORS.textPrimary,
        fontFamily: "system-ui, -apple-system, sans-serif", overflow: "hidden", position: "relative",
      }}
    >
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 9999, background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px)", opacity: 0.2 }} />

      {/* --- BARRA SUPERIOR (DESIGN ORIGINAL) --- */}
      <div style={{ height: "70px", background: COLORS.surface, borderBottom: `2px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", boxShadow: `0 4px 6px rgba(0,0,0,0.1)`, zIndex: 100 }}>
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
          <button onClick={toggleMute} style={{ background: "transparent", border: `1px solid ${COLORS.primary}`, color: COLORS.primary, width: "36px", height: "36px", borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.primary; e.currentTarget.style.color = COLORS.background; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.primary; }}>
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button onClick={() => setShowRules(true)} style={{ background: "transparent", border: `1px solid ${COLORS.primary}`, color: COLORS.primary, padding: "0 14px", height: "36px", borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, transition: "all 0.2s", textTransform: "uppercase" }} onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.primary; e.currentTarget.style.color = COLORS.background; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.primary; }}>
            <Info size={16} /> Protocolos
          </button>
        </div>
      </div>

      {/* --- ÁREA CENTRAL (MAPA 3D + LOG) --- */}
      <div style={{ flex: 1, position: "relative", display: "flex" }}>
        
        {/* CONTAINER DO MAPA 3D */}
        <div style={{ flex: 1, position: "relative", background: "#000" }}>
           <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
        </div>

        {/* LOG LATERAL */}
        <div style={{ position: "absolute", top: 20, right: 20, width: 340, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 16, zIndex: 500, boxShadow: `0 4px 12px rgba(0,0,0,0.3)` }}>
          <div style={{ borderBottom: `1px solid ${COLORS.border}`, marginBottom: 12, paddingBottom: 8, display: "flex", alignItems: "center", gap: 8, color: COLORS.primary }}>
            <Terminal size={16} />
            <span style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase" }}>Log do Sistema</span>
          </div>
          <div style={{ height: 120, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
            {history.map((log) => (
              <div key={log.id} style={{ padding: "6px 8px", borderLeft: `3px solid ${log.success ? COLORS.success : COLORS.danger}`, background: COLORS.surfaceLight, color: COLORS.textSecondary, fontSize: 11, fontFamily: "monospace" }}>
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
                    {/* AQUI ESTÁ A MARGEM DE LUCRO RESTAURADA */}
                    {selected.lucroPercentInformado && (
                      <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 6 }}>
                        Margem de Lucro Declarada: {selected.lucroPercentInformado}%
                      </div>
                    )}
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

      {/* --- BARRA INFERIOR (DESIGN ORIGINAL) --- */}
      <div style={{ height: "140px", background: COLORS.surface, borderTop: `2px solid ${COLORS.border}`, display: "flex", flexDirection: "column", zIndex: 100 }}>
        <div style={{ padding: "8px 24px", background: COLORS.surfaceLight, borderBottom: `1px solid ${COLORS.border}`, fontSize: 12, fontWeight: 700, color: COLORS.textSecondary, textTransform: "uppercase", letterSpacing: 1, display: "flex", alignItems: "center", gap: 8 }}>
          <Database size={14} /> Fila de Análise Prioritária
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 24px", gap: 16, overflowX: "auto" }}>
          {pendingIncidents.length === 0 ? (
            <div style={{ flex: 1, textAlign: "center", color: COLORS.textSecondary, fontSize: 14, fontWeight: 500, opacity: 0.7 }}>— Todos os casos foram processados —</div>
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
                  <div style={{ fontSize: 11, color: isSelected ? COLORS.primary : COLORS.textSecondary, borderTop: `1px solid ${COLORS.border}`, paddingTop: 6, marginTop: 6, fontWeight: 600, textTransform: "uppercase" }}>{inc.regime}</div>
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