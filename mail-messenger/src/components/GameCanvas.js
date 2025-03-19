import React, { useRef, useEffect } from 'react';
import './GameCanvas.css';

const GameCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // This is where we'll initialize Three.js in a future step
    console.log('GameCanvas mounted');

    return () => {
      // Cleanup function
      console.log('GameCanvas unmounted');
    };
  }, []);

  return (
    <div className="game-canvas-container">
      <canvas ref={canvasRef} className="game-canvas" />
    </div>
  );
};

export default GameCanvas; 