import React from 'react';
import useGameStore from '../game/gameStore';
import './UI.css';

const UI = () => {
  // Get state from the game store
  const playerState = useGameStore(state => state.playerState);
  const worldState = useGameStore(state => state.worldState);
  const inputState = useGameStore(state => state.inputState);
  const isLoading = useGameStore(state => state.loadingState.isLoading);

  // Don't render UI if loading
  if (isLoading) return null;

  // Format position to 2 decimal places
  const formatPosition = (vec) => {
    return `(${vec.x.toFixed(2)}, ${vec.y.toFixed(2)}, ${vec.z.toFixed(2)})`;
  };

  return (
    <div className="ui-container">
      <div className="ui-panel">
        <h2>Game Stats</h2>
        <div className="ui-section">
          <h3>Player</h3>
          <p>Position: {formatPosition(playerState.position)}</p>
          <p>Transportation: {playerState.currentTransportation}</p>
          <p>Has Mail: {playerState.hasMail ? 'Yes' : 'No'}</p>
          <p>Speed: {playerState.speed.toFixed(2)}</p>
        </div>
        
        <div className="ui-section">
          <h3>World</h3>
          <p>Time: {worldState.timeOfDay.toFixed(1)} hours</p>
          <p>Weather: {worldState.weather}</p>
          <p>Score: {worldState.score}</p>
        </div>
        
        <div className="ui-section">
          <h3>Controls</h3>
          <p>WASD or Arrow Keys to move</p>
          <p>Space to jump</p>
          <p>
            Input: [
            {inputState.forward ? 'W' : ''}
            {inputState.backward ? 'S' : ''}
            {inputState.left ? 'A' : ''}
            {inputState.right ? 'D' : ''}
            {inputState.jump ? 'Space' : ''}
            ]
          </p>
        </div>
      </div>
    </div>
  );
};

export default UI; 