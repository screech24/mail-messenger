import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import useGameStore from '../game/gameStore';
import './GameCanvas.css';

const GameCanvas = () => {
  const canvasRef = useRef(null);
  // Refs to hold Three.js objects
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const frameIdRef = useRef(null);

  // We'll use these state variables in future steps
  // const playerPosition = useGameStore(state => state.playerState.position);
  // const updatePlayerPosition = useGameStore(state => state.updatePlayerPosition);

  useEffect(() => {
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

      // Add lighting
      addLighting(scene);

      // Add a simple ground plane
      addGroundPlane(scene);

      // Start animation loop
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

    // Add a simple ground plane
    const addGroundPlane = (scene) => {
      const groundGeometry = new THREE.PlaneGeometry(100, 100);
      const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x7cac85, // Green color for grass
        roughness: 0.8,
        metalness: 0.2
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2; // Rotate to be horizontal
      ground.position.y = 0; // Position at y=0
      scene.add(ground);
    };

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

      // Request the next frame
      frameIdRef.current = requestAnimationFrame(animate);

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
    };
  }, []); // Empty dependency array means this only runs once

  return (
    <div className="game-canvas-container">
      <canvas ref={canvasRef} className="game-canvas" />
    </div>
  );
};

export default GameCanvas; 