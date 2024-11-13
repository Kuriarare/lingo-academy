// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/userSlice';
import sidebarReducer from '../redux/sidebarSlice'; // Import sidebarReducer

// Utility functions to save and load state from localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (e) {
    console.error('Could not save state', e);
  }
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined; // Let the reducer initialize the state
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error('Could not load state', e);
    return undefined;
  }
};

// Load the state from localStorage
const persistedState = loadState();

// Configure the store
const store = configureStore({
  reducer: {
    user: userReducer,
    sidebar: sidebarReducer, // Add sidebarReducer to the store
  },
  preloadedState: persistedState, 
});

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  saveState({
    user: store.getState().user,      // Save only the user slice
    sidebar: store.getState().sidebar, // Save the sidebar state as well
  });
});

export default store;
