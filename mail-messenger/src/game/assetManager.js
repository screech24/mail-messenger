import * as THREE from 'three';
import useGameStore from './gameStore';

// Create a singleton loading manager that will be shared across the application
const loadingManager = new THREE.LoadingManager();

// Set up loading manager events
loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
  console.log(`Started loading: ${url} (${itemsLoaded}/${itemsTotal} items)`);
  useGameStore.getState().setLoading(true);
  useGameStore.getState().setLoadingProgress(0);
};

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  const progress = itemsLoaded / itemsTotal;
  console.log(`Loading: ${url} (${itemsLoaded}/${itemsTotal} items) - ${Math.round(progress * 100)}%`);
  useGameStore.getState().setLoadingProgress(progress);
};

loadingManager.onLoad = () => {
  console.log('Loading complete!');
  useGameStore.getState().setLoading(false);
  useGameStore.getState().setLoadingProgress(1);
};

loadingManager.onError = (url) => {
  console.error('Error loading:', url);
};

// Generate procedural player model
export const createPlayerModel = () => {
  // Create a simple character using Three.js geometries
  const group = new THREE.Group();
  
  // Body
  const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x2e86de });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 0.5;
  group.add(body);
  
  // Head
  const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
  const headMaterial = new THREE.MeshStandardMaterial({ color: 0xf5f6fa });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 1.3;
  group.add(head);
  
  // Add eyes
  const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
  const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x2f3640 });
  
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.1, 1.35, 0.2);
  group.add(leftEye);
  
  const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  rightEye.position.set(0.1, 1.35, 0.2);
  group.add(rightEye);
  
  return group;
};

// Generate procedural building models based on type
export const createBuildingModel = (type = 'house') => {
  const group = new THREE.Group();
  
  switch (type) {
    case 'post_office':
      // Create post office - larger building with distinctive color
      const postOfficeBase = new THREE.BoxGeometry(5, 3, 4);
      const postOfficeMaterial = new THREE.MeshStandardMaterial({ color: 0xe74c3c });
      const postOffice = new THREE.Mesh(postOfficeBase, postOfficeMaterial);
      postOffice.position.y = 1.5;
      group.add(postOffice);
      
      // Roof
      const roofGeometry = new THREE.ConeGeometry(3.5, 2, 4);
      const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x7f8c8d });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.y = 4;
      roof.rotation.y = Math.PI / 4;
      group.add(roof);
      
      // Sign
      const signGeometry = new THREE.BoxGeometry(2, 0.5, 0.1);
      const signMaterial = new THREE.MeshStandardMaterial({ color: 0xf1c40f });
      const sign = new THREE.Mesh(signGeometry, signMaterial);
      sign.position.set(0, 3.5, 2.05);
      group.add(sign);
      
      break;
      
    case 'house':
    default:
      // Create standard house
      const baseGeometry = new THREE.BoxGeometry(2, 2, 2);
      const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: Math.random() > 0.5 ? 0xecf0f1 : 0xf39c12 
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = 1;
      group.add(base);
      
      // Roof
      const houseRoofGeometry = new THREE.ConeGeometry(1.5, 1, 4);
      const houseRoofMaterial = new THREE.MeshStandardMaterial({ color: 0xe74c3c });
      const houseRoof = new THREE.Mesh(houseRoofGeometry, houseRoofMaterial);
      houseRoof.position.y = 2.5;
      houseRoof.rotation.y = Math.PI / 4;
      group.add(houseRoof);
      
      // Door
      const doorGeometry = new THREE.PlaneGeometry(0.5, 1);
      const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x6d4c41 });
      const door = new THREE.Mesh(doorGeometry, doorMaterial);
      door.position.set(0, 0.5, 1.01);
      group.add(door);
      
      // Window
      const windowGeometry = new THREE.PlaneGeometry(0.5, 0.5);
      const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x81ecec });
      const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
      window1.position.set(-0.5, 1.2, 1.01);
      group.add(window1);
      
      const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
      window2.position.set(0.5, 1.2, 1.01);
      group.add(window2);
      
      break;
  }
  
  return group;
};

// Generate procedural terrain
export const createTerrainModel = (size = 100, resolution = 128) => {
  // Create a heightmap using simplex noise (simulated with Math.random for now)
  // In a real implementation, you would use actual noise functions
  const geometry = new THREE.PlaneGeometry(size, size, resolution, resolution);
  
  // Add some simple height variation
  const vertices = geometry.attributes.position.array;
  for (let i = 0; i < vertices.length; i += 3) {
    // Only modify y values (height)
    // This is a simple random height map, could be replaced with noise functions
    if (i % 3 === 1) { // y value
      vertices[i] = Math.random() * 0.5; // Small hills, max height 0.5
    }
  }
  
  // Update normals for proper lighting
  geometry.computeVertexNormals();
  
  // Create material with green color for grass
  const material = new THREE.MeshStandardMaterial({
    color: 0x7cac85,
    roughness: 0.8,
    metalness: 0.2,
    flatShading: true
  });
  
  // Create mesh
  const terrain = new THREE.Mesh(geometry, material);
  terrain.rotation.x = -Math.PI / 2; // Rotate to be horizontal
  
  return terrain;
};

// Export loading manager for use in other modules
export { loadingManager }; 