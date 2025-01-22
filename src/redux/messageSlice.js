import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Async thunk for fetching unread messages
export const fetchUnreadMessages = createAsyncThunk(
  'messages/fetchUnreadMessages',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/chat/unread-global-messages/${userId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch unread messages');
      }
      const data = await response.json();
      return data; // Return the data from the API
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice definition
const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    unreadCounts: {}, // Stores unread messages for each room
    totalUnread: 0,   // Total unread messages count
    status: 'idle',   // Loading status
    error: null,      // Error state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnreadMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUnreadMessages.fulfilled, (state, action) => {
        state.status = 'succeeded';
      
        if (Array.isArray(action.payload)) {
          // Calculate unread counts per room
          const roomUnreadCounts = action.payload.reduce((acc, item) => {
            Object.entries(item).forEach(([key, value]) => {
              if (typeof value === 'number') {
                acc[key] = (acc[key] || 0) + value;
              }
            });
            return acc;
          }, {});
      
          // Save room-specific unread counts
          state.unreadCounts = roomUnreadCounts;
      
          // Calculate total unread count
          state.totalUnread = Object.values(roomUnreadCounts).reduce(
            (total, count) => total + count,
            0
          );
        } else {
          console.error('Unexpected data format:', action.payload);
        }
      })
      .addCase(fetchUnreadMessages.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default messageSlice.reducer;
