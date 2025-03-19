import React from 'react';
import useGameStore from '../game/gameStore';
import './LoadingScreen.css';

const LoadingScreen = () => {
  const { isLoading, progress } = useGameStore(state => state.loadingState);
  
  // Convert progress (0-1) to percentage (0-100)
  const percentage = Math.round(progress * 100);
  
  // Only render if we're loading
  if (!isLoading) return null;
  
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <h1>Mail Messenger</h1>
        <div className="loading-bar-container">
          <div 
            className="loading-bar" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="loading-text">
          Loading assets: {percentage}%
        </div>
        <div className="loading-tip">
          Tip: Use WASD to move and Spacebar to jump!
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 