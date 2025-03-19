# Mail Messenger Architecture

## Project Structure

The project follows a React application structure with additional organization for game-specific components:

```
mail-messenger/
├── public/              # Static files
│   ├── index.html       # HTML entry point
│   ├── manifest.json    # PWA manifest
│   └── ...              # Other static assets
├── src/                 # Source code
│   ├── components/      # React UI components
│   ├── hooks/           # Custom React hooks
│   ├── contexts/        # React context providers
│   ├── utils/           # Utility functions
│   ├── assets/          # Game assets (audio, icons)
│   ├── game/            # Game-specific logic
│   ├── App.js           # Main React component
│   ├── index.js         # JavaScript entry point
│   └── ...              # Other React files
└── package.json         # Dependencies and scripts
```

## Installed Dependencies

- **Three.js**: 3D rendering library for browser-based graphics
- **Cannon.js**: Physics engine for realistic movement and collisions
- **Zustand**: State management library for React applications
- **Supabase**: Backend-as-a-Service for data storage and authentication
- **Web-vitals**: Library for measuring web vitals metrics

## Component Descriptions

### React Structure

- **index.js**: The entry point for the React application that renders the root component
- **App.js**: The main React component that will include the game canvas and UI
- **serviceWorkerRegistration.js**: Handles PWA service worker registration
- **service-worker.js**: The PWA service worker for offline capabilities

### To Be Implemented

#### Game Components (src/components/)
- **GameCanvas.js**: Will contain the Three.js canvas and rendering logic
- **UI.js**: Will contain the game's user interface elements

#### Game Logic (src/game/)
- **gameStore.js**: Will use Zustand for state management
- **assetManager.js**: Will handle loading and managing game assets
- **physics.js**: Will integrate Cannon.js for physics simulation

## Architectural Decisions

1. **React + PWA**: Provides component-based UI structure and offline capabilities
2. **Directory Structure**: Organizes code by function (components, hooks, etc.) for better maintainability
3. **Procedural Assets**: All 3D assets will be created programmatically using Three.js
4. **State Management**: Zustand will provide easy-to-use global state management
5. **Physics Engine**: Cannon.js will be used for realistic movement and collisions
