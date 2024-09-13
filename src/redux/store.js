import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/userSlice';

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

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: persistedState, 
});

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  saveState({
    user: store.getState().user, // Save only the user slice
  });
});

export default store;
