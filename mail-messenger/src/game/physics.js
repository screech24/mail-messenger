import * as CANNON from 'cannon-es';
import { Vector3 } from 'three';
import useGameStore from './gameStore';

// Physics world configuration
let world = null;
let physicsBodies = {};
let lastTime = 0;

// Physics materials
const defaultMaterial = new CANNON.Material('default');
const playerMaterial = new CANNON.Material('player');
const groundMaterial = new CANNON.Material('ground');
const buildingMaterial = new CANNON.Material('building');

// Create contact material pairs for different interactions
const playerGroundContact = new CANNON.ContactMaterial(
  playerMaterial,
  groundMaterial,
  {
    friction: 0.5,
    restitution: 0.3,
  }
);

const playerBuildingContact = new CANNON.ContactMaterial(
  playerMaterial,
  buildingMaterial,
  {
    friction: 0.2,
    restitution: 0.1,
  }
);

// Initialize physics world
export const initPhysicsWorld = () => {
  // Create world with gravity
  world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0), // Earth gravity
  });

  // Add contact materials
  world.addContactMaterial(playerGroundContact);
  world.addContactMaterial(playerBuildingContact);
  world.defaultContactMaterial.friction = 0.1;
  world.defaultContactMaterial.restitution = 0.3;

  // Set solver iterations for better stability
  world.solver.iterations = 10;

  console.log('Physics world initialized');
  return world;
};

// Step the physics world forward in time
export const stepPhysicsWorld = (deltaTime) => {
  if (!world) return;
  
  // Update physics world
  world.step(1/60, deltaTime, 3);
  
  // Sync Three.js objects with Cannon.js bodies
  syncBodies();
};

// Create physics body for player
export const createPlayerPhysics = (position) => {
  if (!world) {
    console.error('Physics world not initialized. Call initPhysicsWorld first.');
    return null;
  }
  
  // Create player physics body
  const radius = 0.3;
  const height = 1.2;
  
  // Use capsule shape for player (combination of cylinder and spheres)
  const shape = new CANNON.Cylinder(radius, radius, height, 8);
  
  // Create body with mass (non-zero for dynamic body)
  const body = new CANNON.Body({
    mass: 70, // kg
    position: new CANNON.Vec3(position.x, position.y + height / 2 + radius, position.z),
    shape: shape,
    material: playerMaterial,
    linearDamping: 0.4, // Air resistance
    angularDamping: 0.6, // Rotational resistance
  });
  
  // Fix rotation to avoid player tipping over
  body.fixedRotation = true;
  body.updateMassProperties();
  
  // Add to world
  world.addBody(body);
  
  // Store reference
  physicsBodies.player = body;
  
  return body;
};

// Create physics for ground/terrain
export const createGroundPhysics = (size) => {
  if (!world) {
    console.error('Physics world not initialized. Call initPhysicsWorld first.');
    return null;
  }
  
  // Create ground as a flat plane for now
  const groundShape = new CANNON.Plane();
  const groundBody = new CANNON.Body({
    mass: 0, // Mass 0 makes it static
    material: groundMaterial,
  });
  
  // Add shape and position
  groundBody.addShape(groundShape);
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // Rotate to be flat
  
  // Add to world
  world.addBody(groundBody);
  
  // Store reference
  physicsBodies.ground = groundBody;
  
  return groundBody;
};

// Create physics body for a building
export const createBuildingPhysics = (type, position, dimensions) => {
  if (!world) {
    console.error('Physics world not initialized. Call initPhysicsWorld first.');
    return null;
  }
  
  let shape;
  let halfExtents;
  
  if (type === 'post_office') {
    // Post office is larger
    halfExtents = new CANNON.Vec3(2.5, 1.5, 2);
  } else {
    // Regular house
    halfExtents = new CANNON.Vec3(1, 1, 1);
  }
  
  // Override dimensions if provided
  if (dimensions) {
    halfExtents = new CANNON.Vec3(
      dimensions.width / 2, 
      dimensions.height / 2, 
      dimensions.depth / 2
    );
  }
  
  // Create box shape
  shape = new CANNON.Box(halfExtents);
  
  // Create static body (mass 0)
  const body = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(position.x, position.y + halfExtents.y, position.z),
    shape: shape,
    material: buildingMaterial,
  });
  
  // Add to world
  world.addBody(body);
  
  // Store reference in a list of buildings
  if (!physicsBodies.buildings) {
    physicsBodies.buildings = [];
  }
  physicsBodies.buildings.push(body);
  
  return body;
};

// Apply forces to player for movement
export const movePlayer = (direction, speed) => {
  if (!physicsBodies.player) return;
  
  const playerBody = physicsBodies.player;
  const force = new CANNON.Vec3(
    direction.x * speed,
    0,
    direction.z * speed
  );
  
  // Apply force at center of mass
  playerBody.applyForce(force);
};

// Sync physics bodies with Three.js objects
const syncBodies = () => {
  // Sync player position
  if (physicsBodies.player) {
    const pos = physicsBodies.player.position;
    const playerPosition = new Vector3(pos.x, pos.y - 0.9, pos.z); // Adjust height to account for shape
    
    // Update the store with the new position from physics
    useGameStore.getState().updatePlayerPosition(playerPosition);
  }
  
  // Other objects could be synced here
};

// Get the physics world for external use
export const getPhysicsWorld = () => world;

// Get physics bodies for debugging
export const getPhysicsBodies = () => physicsBodies;

// Reset the physics world (useful for level transitions)
export const resetPhysics = () => {
  if (world) {
    // Remove all bodies
    for (const key in physicsBodies) {
      if (Array.isArray(physicsBodies[key])) {
        physicsBodies[key].forEach(body => {
          world.removeBody(body);
        });
      } else {
        world.removeBody(physicsBodies[key]);
      }
    }
    
    // Clear references
    physicsBodies = {};
  }
};

// Handle collisions (can be expanded with more specific collision handling)
export const handleCollisions = () => {
  if (!world) return;
  
  world.addEventListener('beginContact', (event) => {
    // Check if player is involved in collision
    const isPlayerCollision = 
      event.bodyA === physicsBodies.player || 
      event.bodyB === physicsBodies.player;
    
    if (isPlayerCollision) {
      // We could trigger events based on what the player collided with
      console.log('Player collision detected');
      
      // Example: Check if collision is with a building
      const buildings = physicsBodies.buildings || [];
      const otherBody = event.bodyA === physicsBodies.player ? event.bodyB : event.bodyA;
      
      if (buildings.includes(otherBody)) {
        console.log('Player collided with building');
        // Here we could trigger building-specific interactions
      }
    }
  });
}; 