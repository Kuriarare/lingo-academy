import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async action to log in a user
export const loginUser = createAsyncThunk('user/loginUser', async (data) => {
  const response = await fetch('http://localhost:8000/login', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const result = await response.json();
  if (result.token) {
    localStorage.setItem('token', result.token);
  }

  return result;
});
// http://localhost:8000
// https://srv570363.hstgr.cloud:8000
// Async action to update user information
export const updateUser = createAsyncThunk('user/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:8000/updateuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user information');
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});


export const uploadAvatar = createAsyncThunk('user/uploadAvatar', async (formData, { rejectWithValue }) => {
  console.log('Starting avatar upload');
  console.log('Form data:', formData);

  try {
    const response = await fetch('http://localhost:8000/uploadavatar', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    console.log('Upload response status:', response.status);

    if (!response.ok) {
      console.error('Upload response error:', await response.text());
      throw new Error('Failed to upload avatar');
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Upload avatar error:', error);
    return rejectWithValue(error.message);
  }
});

// The main user slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login actions
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Handle update user actions
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })

      // Handle avatar upload actions
      .addCase(uploadAvatar.pending, (state) => {
        console.log('Avatar upload pending...');
        state.status = 'loading';
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userInfo.user.avatarUrl = action.payload.url;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        console.error('Avatar upload failed:', action.payload || action.error.message);
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
