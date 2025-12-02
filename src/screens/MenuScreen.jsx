import React, { useEffect, useRef, useState } from 'react';
import { Play, Volume2, DoorOpen, MonitorPlay, VolumeX } from 'lucide-react';
import MenuButton from '../components/MenuButton';

// IMPORTAÇÃO DOS ARQUIVOS LOCAIS
// Certifique-se que os arquivos estão na pasta src/assets/ com esses nomes exatos
import bgMusicFile from '../assets/menu_music.mp3';
import bgImageFile from '../assets/background.png'; 

// Caso não tenha baixado a imagem ainda, usarei esta URL de backup (tema corporativo/auditoria)
// Se já tiver baixado, o código vai priorizar o seu arquivo local se o import funcionar,
// ou você pode remover a linha do backup.
const BACKUP_IMAGE = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop";

const MenuScreen = ({ onStart, onOptions, onExit }) => {
  const audioRef = useRef(new Audio(bgMusicFile));
  const [isMuted, setIsMuted] = useState(true);

  // Tenta tocar ao carregar
  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.5;

    // A maioria dos navegadores bloqueia autoplay. 
    // Tentamos tocar, se falhar, o usuário clica no botão de som.
    audio.play()
      .then(() => setIsMuted(false))
      .catch(() => setIsMuted(true));

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const toggleSound = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsMuted(false);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      // Usa a imagem importada. Se der erro no import (arquivo não existe), usa o backup.
      backgroundImage: `url(${bgImageFile || BACKUP_IMAGE})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      overflow: 'hidden',
      margin: 0,
      padding: 0
    }}>
      
      {/* Camada Azul Escuro/Corporativo (Auditoria Sária) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(10, 20, 40, 0.7) 0%, rgba(5, 10, 20, 0.9) 100%)',
      }} />

      {/* Botão de Som */}
      <button 
        onClick={toggleSound}
        style={{
          position: 'absolute', top: 30, right: 30, zIndex: 50,
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', padding: '12px', borderRadius: '50%', cursor: 'pointer',
          backdropFilter: 'blur(5px)'
        }}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      {/* Título Principal */}
      <div style={{ position: 'relative', zIndex: 10, padding: '0 80px', flex: 1, display: 'flex', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 15, background: 'rgba(0,0,0,0.4)', width: 'fit-content', padding: '8px 16px', borderRadius: '4px', borderLeft: '4px solid #facc15' }}>
            <MonitorPlay size={24} color="#facc15" />
            <span style={{ color: '#e5e7eb', letterSpacing: '2px', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase' }}>
              Sistema de Auditoria Federal
            </span>
          </div>
          
          <h1 style={{
            fontSize: 'clamp(60px, 8vw, 120px)', // Responsivo
            margin: 0,
            lineHeight: 0.9,
            color: '#fff',
            fontFamily: 'Impact, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontStyle: 'italic'
          }}>
            ROTA <span style={{ color: 'transparent', WebkitTextStroke: '2px #fff' }}>FISCAL</span>
          </h1>
          <p style={{ color: '#9ca3af', maxWidth: '500px', marginTop: '20px', fontSize: '16px', lineHeight: '1.5' }}>
            Analise dados, identifique fraudes e decida o futuro das empresas de Fortaleza.
          </p>
        </div>
      </div>

      {/* Menu Inferior */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '50px 80px',
        display: 'flex',
        gap: '24px',
        background: 'linear-gradient(to top, #000 0%, transparent 100%)'
      }}>
        <MenuButton onClick={onStart} icon={<Play size={20} />}>Iniciar Plantão</MenuButton>
        <MenuButton onClick={onOptions} icon={<Volume2 size={20} />}>Opções</MenuButton>
        <MenuButton onClick={onExit} icon={<DoorOpen size={20} />}>Sair</MenuButton>
      </div>
    </div>
  );
};

export default MenuScreen;