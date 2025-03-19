import React, { useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import UI from './components/UI';
import useGameStore from './game/gameStore';
import './App.css';

function App() {
  // Get state and actions from the game store
  const playerState = useGameStore(state => state.playerState);
  const worldState = useGameStore(state => state.worldState);
  const settingsState = useGameStore(state => state.settingsState);
  const updateTimeOfDay = useGameStore(state => state.updateTimeOfDay);

  // Log initial state once on mount
  useEffect(() => {
    // Log the initial state to verify it's working
    console.log('Player State:', playerState);
    console.log('World State:', worldState);
    console.log('Settings State:', settingsState);
    
    // Example of updating state - only runs once
    updateTimeOfDay(12); // Set time to noon
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this only runs once

  return (
    <div className="App">
      <GameCanvas />
      <UI />
    </div>
  );
}

export default App;
