import React from 'react';
import useGameStore from '../game/gameStore';
import './UI.css';

const UI = () => {
  // Get state from the game store
  const score = useGameStore(state => state.worldState.score);
  const timeOfDay = useGameStore(state => state.worldState.timeOfDay);
  const hasMail = useGameStore(state => state.playerState.hasMail);
  const currentTransportation = useGameStore(state => state.playerState.currentTransportation);
  
  // Format the time display
  const hours = Math.floor(timeOfDay);
  const minutes = Math.floor((timeOfDay - hours) * 60);
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  return (
    <div className="game-ui">
      <div className="ui-top">
        <div className="ui-score">Score: {score}</div>
        <div className="ui-time">Time: {timeString}</div>
      </div>
      <div className="ui-center">
        <div className={`ui-status ${hasMail ? 'has-mail' : ''}`}>
          {hasMail ? 'Carrying Mail ✉️' : 'No Mail'}
        </div>
        <div className="ui-transportation">
          Transportation: {currentTransportation}
        </div>
      </div>
      <div className="ui-bottom">
        <div className="ui-message">Welcome to Mail Messenger!</div>
      </div>
    </div>
  );
};

export default UI; 