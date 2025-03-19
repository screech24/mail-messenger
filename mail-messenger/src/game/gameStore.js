import { create } from 'zustand';
import { Vector3 } from 'three';

// Create Zustand store
const useGameStore = create((set) => ({
  // Player state
  playerState: {
    position: new Vector3(0, 0, 0),
    rotation: new Vector3(0, 0, 0),
    currentTransportation: 'rollerblade', // Default transportation
    hasMail: false,
    speed: 0,
    health: 100,
  },
  
  // World state
  worldState: {
    timeOfDay: 0, // 0-24 hours
    weather: 'clear', // clear, rainy, snowy
    activeQuests: [],
    score: 0,
  },
  
  // Settings state
  settingsState: {
    soundVolume: 0.5, // 0-1
    musicVolume: 0.5, // 0-1
    graphicsQuality: 'medium', // low, medium, high
    controlsEnabled: true,
  },
  
  // Asset loading state
  loadingState: {
    isLoading: true,
    progress: 0, // 0-1
    assetsLoaded: false,
  },
  
  // Input state for player control
  inputState: {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  },
  
  // Actions for player state
  updatePlayerPosition: (position) => 
    set((state) => ({
      playerState: {
        ...state.playerState,
        position,
      }
    })),
  
  updatePlayerRotation: (rotation) => 
    set((state) => ({
      playerState: {
        ...state.playerState,
        rotation,
      }
    })),
  
  setTransportation: (transportationType) => 
    set((state) => ({
      playerState: {
        ...state.playerState,
        currentTransportation: transportationType,
      }
    })),
  
  setMailStatus: (hasMail) => 
    set((state) => ({
      playerState: {
        ...state.playerState,
        hasMail,
      }
    })),
  
  updatePlayerSpeed: (speed) =>
    set((state) => ({
      playerState: {
        ...state.playerState,
        speed,
      }
    })),
  
  // Actions for world state
  updateTimeOfDay: (time) => 
    set((state) => ({
      worldState: {
        ...state.worldState,
        timeOfDay: time,
      }
    })),
  
  updateWeather: (weather) => 
    set((state) => ({
      worldState: {
        ...state.worldState,
        weather,
      }
    })),
  
  addQuest: (quest) => 
    set((state) => ({
      worldState: {
        ...state.worldState,
        activeQuests: [...state.worldState.activeQuests, quest],
      }
    })),
  
  completeQuest: (questId) => 
    set((state) => ({
      worldState: {
        ...state.worldState,
        activeQuests: state.worldState.activeQuests.filter(quest => quest.id !== questId),
        score: state.worldState.score + 100, // Reward for completing a quest
      }
    })),
  
  // Actions for settings state
  updateSoundVolume: (volume) => 
    set((state) => ({
      settingsState: {
        ...state.settingsState,
        soundVolume: volume,
      }
    })),
  
  updateMusicVolume: (volume) => 
    set((state) => ({
      settingsState: {
        ...state.settingsState,
        musicVolume: volume,
      }
    })),
  
  setGraphicsQuality: (quality) => 
    set((state) => ({
      settingsState: {
        ...state.settingsState,
        graphicsQuality: quality,
      }
    })),
  
  toggleControls: (enabled) => 
    set((state) => ({
      settingsState: {
        ...state.settingsState,
        controlsEnabled: enabled,
      }
    })),
    
  // Actions for loading state
  setLoading: (isLoading) => 
    set((state) => ({
      loadingState: {
        ...state.loadingState,
        isLoading,
      }
    })),
  
  setLoadingProgress: (progress) => 
    set((state) => ({
      loadingState: {
        ...state.loadingState,
        progress,
      }
    })),
  
  setAssetsLoaded: (assetsLoaded) => 
    set((state) => ({
      loadingState: {
        ...state.loadingState,
        assetsLoaded,
        isLoading: !assetsLoaded,
      }
    })),
    
  // Actions for input state
  setInputState: (input, value) => 
    set((state) => ({
      inputState: {
        ...state.inputState,
        [input]: value,
      }
    })),
    
  resetInputState: () =>
    set((state) => ({
      inputState: {
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
      }
    })),
}));

export default useGameStore; 