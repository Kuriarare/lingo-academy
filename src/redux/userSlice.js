import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Get the environment variable
const LOCAL_HOST = 'http://localhost:8000'

// Async action to log in a user
export const loginUser = createAsyncThunk('user/loginUser', async (data) => {

  const response = await fetch(`${LOCAL_HOST}/auth/login`, { // Use template literal to insert LOCAL_HOST
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

// Async action to update user information
export const updateUser = createAsyncThunk('user/updateUser', async (userData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${LOCAL_HOST}/users/updateuser`, { // Use template literal here as well
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
    if (response.status === 204) {
  return {}; // Return an empty object for successful update
}
    return updatedUser;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async action to upload avatar
export const uploadAvatar = createAsyncThunk('user/uploadAvatar', async (formData, { rejectWithValue }) => {
  console.log('Starting avatar upload');
  console.log('Form data:', formData);

  try {
    const response = await fetch(`${LOCAL_HOST}/uploadavatar`, { // Use template literal here as well
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    console.log('Upload response status:', response.status);

    if (!response.ok) {

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
    updateUserStatus: (state, action) => {
      const { id, online } = action.payload; 
      const user = state.userInfo.user;
       if (user.teacher) {
        console.log('Updating teacher status');
        if (user.teacher.id === id) {
          user.teacher.online = online;
        }
      }
     else if (user && user.students) {
        // Find the user in the students array and update their online status
        const studentIndex = user.students.findIndex(student => student.id === id);
        if (studentIndex !== -1) {
          user.students[studentIndex].online = online; 
        }
      }
      
  
    },
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
        state.userInfo.user= {
          ...state.userInfo.user,
          ...action.meta.arg, // Merge the updated fields
        };
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

export const { logout, updateUserStatus } = userSlice.actions;

export default userSlice.reducer;
