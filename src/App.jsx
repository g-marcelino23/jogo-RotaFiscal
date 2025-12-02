import React, { useState } from 'react';
import MenuScreen from './screens/MenuScreen';
import OptionsScreen from './screens/OptionsScreen';
import StoryScreen from './screens/StoryScreen';
import GameScreen from './screens/GameScreen';
import ResultsScreen from './screens/ResultsScreen';

const App = () => {
  const [screen, setScreen] = useState('menu');
  const [volume, setVolume] = useState(0.5);
  const [resultsData, setResultsData] = useState(null);

  const handleGameEnd = (stats) => {
    setResultsData(stats);
    setScreen('results');
  };

  const handleExit = () => {
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

export default App;