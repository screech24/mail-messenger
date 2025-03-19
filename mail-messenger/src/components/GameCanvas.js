import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import useGameStore from '../game/gameStore';
import { loadingManager, createPlayerModel, createBuildingModel, createTerrainModel } from '../game/assetManager';
import { 
  initPhysicsWorld, 
  stepPhysicsWorld, 
  createPlayerPhysics, 
  createGroundPhysics, 
  createBuildingPhysics,
  handleCollisions
} from '../game/physics';
import './GameCanvas.css';

const GameCanvas = () => {
  const canvasRef = useRef(null);
  // Refs to hold Three.js objects
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const frameIdRef = useRef(null);
  const playerRef = useRef(null);
  const lastTimeRef = useRef(0);
  // Physics refs
  const physicsWorldRef = useRef(null);

  // Game state
  const isLoading = useGameStore(state => state.loadingState.isLoading);
  const playerPosition = useGameStore(state => state.playerState.position);
  const updatePlayerPosition = useGameStore(state => state.updatePlayerPosition);

  useEffect(() => {
    // Don't initialize if we're still loading or no canvas ref
    if (isLoading || !canvasRef.current) return;

    // Initialize Three.js scene
    const initScene = () => {
      // Create scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x87ceeb); // Sky blue background
      sceneRef.current = scene;

      // Create camera with 75-degree FOV
      const camera = new THREE.PerspectiveCamera(
        75, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
      );
      camera.position.set(0, 1.7, 5); // Position camera at eye level
      cameraRef.current = camera;

      // Create WebGL renderer
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      rendererRef.current = renderer;

      // Initialize physics world
      physicsWorldRef.current = initPhysicsWorld();
      
      // Initialize collision detection
      handleCollisions();

      // Add lighting
      addLighting(scene);

      // Add procedural assets
      loadAssets(scene);

      // Start animation loop
      lastTimeRef.current = performance.now();
      animate();
    };

    // Add basic lighting to the scene
    const addLighting = (scene) => {
      // Ambient light for overall illumination
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      // Directional light for shadows and directional illumination
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 10);
      scene.add(directionalLight);
    };

    // Load procedural assets using the asset manager
    const loadAssets = (scene) => {
      // Create terrain
      const terrain = createTerrainModel(100, 64);
      scene.add(terrain);
      
      // Create ground physics
      createGroundPhysics(100);

      // Create player character
      const player = createPlayerModel();
      player.position.set(0, 0, 0);
      scene.add(player);
      playerRef.current = player;
      
      // Create player physics
      createPlayerPhysics(player.position);

      // Create post office
      const postOffice = createBuildingModel('post_office');
      postOffice.position.set(10, 0, 10);
      scene.add(postOffice);
      
      // Create post office physics
      createBuildingPhysics('post_office', postOffice.position, {
        width: 5,
        height: 3,
        depth: 4
      });

      // Create houses - a few random houses around the scene
      for (let i = 0; i < 5; i++) {
        const house = createBuildingModel('house');
        // Position houses randomly in a grid
        const x = (i % 3) * 8 - 8;
        const z = Math.floor(i / 3) * 8 - 8;
        house.position.set(x, 0, z);
        scene.add(house);
        
        // Create house physics
        createBuildingPhysics('house', house.position, {
          width: 2,
          height: 2,
          depth: 2
        });
      }

      // Signal that all assets are loaded
      useGameStore.getState().setAssetsLoaded(true);
    };

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

      // Request the next frame
      frameIdRef.current = requestAnimationFrame(animate);
      
      // Calculate delta time for physics
      const time = performance.now();
      const deltaTime = (time - lastTimeRef.current) / 1000; // in seconds
      lastTimeRef.current = time;
      
      // Step physics world forward
      stepPhysicsWorld(deltaTime);

      // Update player model position based on game state
      if (playerRef.current) {
        playerRef.current.position.copy(playerPosition);
      }
      
      // Update camera to follow player
      if (cameraRef.current && playerRef.current) {
        // Position camera behind player with slight offset and height
        cameraRef.current.position.x = playerPosition.x;
        cameraRef.current.position.z = playerPosition.z + 5; // Camera follows behind at distance of 5
        cameraRef.current.position.y = playerPosition.y + 1.7; // Camera at eye level
        cameraRef.current.lookAt(playerPosition); // Look at player
      }

      // Render the scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      // Update camera aspect ratio
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();

      // Update renderer size
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    // Initialize the scene
    initScene();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      // Cancel animation frame
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }

      // Remove event listener
      window.removeEventListener('resize', handleResize);

      // Dispose of Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }

      // Clear refs
      sceneRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
      playerRef.current = null;
      physicsWorldRef.current = null;
    };
  }, [isLoading, playerPosition]); // Dependencies include isLoading and playerPosition

  // Don't render canvas if loading
  if (isLoading) return null;

  return (
    <div className="game-canvas-container">
      <canvas ref={canvasRef} className="game-canvas" />
    </div>
  );
};

export default GameCanvas; 