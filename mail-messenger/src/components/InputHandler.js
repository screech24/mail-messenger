import React, { useEffect } from 'react';
import { Vector3 } from 'three';
import useGameStore from '../game/gameStore';
import { movePlayer } from '../game/physics';

const InputHandler = () => {
  // Get state and actions from store
  const inputState = useGameStore(state => state.inputState);
  const playerPosition = useGameStore(state => state.playerState.position);
  const setInputState = useGameStore(state => state.setInputState);
  const resetInputState = useGameStore(state => state.resetInputState);
  const updatePlayerSpeed = useGameStore(state => state.updatePlayerSpeed);
  
  // Set up keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore events when typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      // Handle movement keys
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setInputState('forward', true);
          break;
        case 's':
        case 'arrowdown':
          setInputState('backward', true);
          break;
        case 'a':
        case 'arrowleft':
          setInputState('left', true);
          break;
        case 'd':
        case 'arrowright':
          setInputState('right', true);
          break;
        case ' ': // Space bar
          setInputState('jump', true);
          break;
        default:
          break;
      }
    };
    
    const handleKeyUp = (e) => {
      // Ignore events when typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      // Handle movement keys
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setInputState('forward', false);
          break;
        case 's':
        case 'arrowdown':
          setInputState('backward', false);
          break;
        case 'a':
        case 'arrowleft':
          setInputState('left', false);
          break;
        case 'd':
        case 'arrowright':
          setInputState('right', false);
          break;
        case ' ': // Space bar
          setInputState('jump', false);
          break;
        default:
          break;
      }
    };
    
    const handleBlur = () => {
      // Reset input state when window loses focus
      resetInputState();
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [setInputState, resetInputState]);
  
  // Process player movement based on input state
  useEffect(() => {
    // Calculate movement direction from inputs
    const processMovement = () => {
      if (!playerPosition) return;
      
      // Create movement direction vector
      const moveDirection = new Vector3(0, 0, 0);
      
      // Apply input states to movement direction
      if (inputState.forward) moveDirection.z -= 1;
      if (inputState.backward) moveDirection.z += 1;
      if (inputState.left) moveDirection.x -= 1;
      if (inputState.right) moveDirection.x += 1;
      
      // Only normalize if there's movement
      if (moveDirection.length() > 0) {
        moveDirection.normalize();
        
        // Variable speed based on transportation type
        // For now, using a fixed speed for rollerblades
        const speed = 500; // Force magnitude for physics
        
        // Apply movement via physics engine
        movePlayer(moveDirection, speed);
        
        // Update player speed in store for UI or other systems
        updatePlayerSpeed(speed);
      } else {
        // Player is not moving
        updatePlayerSpeed(0);
      }
    };
    
    // Process movement immediately and set up interval for continuous updates
    processMovement();
    
    // Currently we don't need an interval because physics steps are called in animation loop
    // But we could add one if we want input processing to happen at a different rate
    
  }, [inputState, playerPosition, updatePlayerSpeed]);
  
  // This component doesn't render anything
  return null;
};

export default InputHandler; 