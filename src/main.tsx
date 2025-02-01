import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import storage from './lib/storage';
import { initializeEquipmentCategories } from './lib/equipment';
import App from './App';
import './index.css';

// Initialize app
const initializeApp = () => {
  try {
    // Initialize settings if they don't exist
    storage.getSettings();
    
    // Initialize equipment categories
    initializeEquipmentCategories();
  } catch (error) {
    console.error('Error initializing app:', error);
  }
};

// Initialize app
initializeApp();

// Render app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);