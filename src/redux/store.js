import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../redux/userSlice';
import sidebarReducer from '../redux/sidebarSlice';
import messageReducer from '../redux/messageSlice'; // Existing messages reducer
import chatReducer from '../redux/chatSlice'; // New chat reducer
import filePreviewReducer from './filePreviewSlice';

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
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error('Could not load state', e);
    return undefined;
  }
};

const persistedState = loadState();

const store = configureStore({
  reducer: {
    user: userReducer,
    sidebar: sidebarReducer,
    messages: messageReducer,
    chat: chatReducer,
    filePreview: filePreviewReducer,
  },
  preloadedState: persistedState,
});

store.subscribe(() => {
  saveState({
    user: store.getState().user,
    sidebar: store.getState().sidebar,
    messages: store.getState().messages,
    chat: store.getState().chat,
  });
});

export default store;