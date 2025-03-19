import React, { useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import UI from './components/UI';
import LoadingScreen from './components/LoadingScreen';
import InputHandler from './components/InputHandler';
import useGameStore from './game/gameStore';
import './App.css';

function App() {
  // Get state and actions from the game store
  const playerState = useGameStore(state => state.playerState);
  const worldState = useGameStore(state => state.worldState);
  const settingsState = useGameStore(state => state.settingsState);
  const loadingState = useGameStore(state => state.loadingState);
  const updateTimeOfDay = useGameStore(state => state.updateTimeOfDay);
  const setLoadingProgress = useGameStore(state => state.setLoadingProgress);
  const setAssetsLoaded = useGameStore(state => state.setAssetsLoaded);

  // Log initial state and set up game simulation
  useEffect(() => {
    // Log the initial state to verify it's working
    console.log('Player State:', playerState);
    console.log('World State:', worldState);
    console.log('Settings State:', settingsState);
    console.log('Loading State:', loadingState);
    
    // Example of updating state - only runs once
    updateTimeOfDay(12); // Set time to noon
    
    // Simulate asset loading process (will be replaced with actual loading later)
    let progress = 0;
    const loadingInterval = setInterval(() => {
      progress += 0.05;
      if (progress >= 1) {
        clearInterval(loadingInterval);
        // Set assets as loaded when progress reaches 100%
        setTimeout(() => {
          setAssetsLoaded(true);
        }, 500); // Short delay to ensure progress bar completes
      } else {
        setLoadingProgress(progress);
      }
    }, 200);
    
    // Cleanup interval on unmount
    return () => {
      clearInterval(loadingInterval);
    };
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array means this only runs once

  return (
    <div className="App">
      <LoadingScreen />
      <GameCanvas />
      <UI />
      <InputHandler />
    </div>
  );
}

export default App;
