import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const extractFileName = (url) => {
  const patternMatch = url.match(/\d{13}-(.+)/);
  if (patternMatch) return decodeURIComponent(patternMatch[1]);
  const lastSegment = url.split('/').pop();
  return decodeURIComponent(lastSegment);
};

export const fetchMessagesForTeacher = createAsyncThunk(
  "chat/fetchMessagesForTeacher",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState().user.userInfo;
      if (!user || user.role !== "teacher" || !user.students?.length) {
        return { lastMessages: {}, unreadCounts: {} };
      }

      const results = await Promise.all(
        user.students.map(async (student) => {
          try {
            const response = await axios.get(
              `${BACKEND_URL}/chat/messages/${student.id}`,
              { params: { email: user.email } }
            );

            const messages = response.data || [];
            const unreadCount = messages.filter(
              (msg) => msg.unread && msg.email !== user.email
            ).length;

            const lastMessage = messages.length > 0 ? messages[0] : null;

            let processedMessage = null;
            if (lastMessage) {
              const userUrl = lastMessage.userUrl;
              const isFile = Boolean(userUrl);

              processedMessage = {
                content: isFile ? extractFileName(userUrl) : lastMessage.message,
                timestamp: lastMessage.timestamp,
                type: isFile ? "file" : "text",
                sender: lastMessage.email,
              };
            }

            return {
              room: student.id,
              lastMessage: processedMessage,
              unreadCount,
            };
          } catch (error) {
            console.error(`Error fetching messages for student ${student.id}:`, error);
            return { room: student.id, lastMessage: null, unreadCount: 0 };
          }
        })
      );

      return results.reduce(
        (acc, curr) => ({
          lastMessages: { ...acc.lastMessages, [curr.room]: curr.lastMessage },
          unreadCounts: { ...acc.unreadCounts, [curr.room]: curr.unreadCount },
        }),
        { lastMessages: {}, unreadCounts: {} }
      );
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUnreadCountsForStudent = createAsyncThunk(
  'chat/fetchUnreadCountsForStudent',
  async (_, { getState }) => {
    const { user } = getState().user.userInfo;
    if (!user || user.role !== 'user') return { studentUnreadCount: 0 };

    try {
      const teacherId = user.teacher?.id || user.teacher;
      if (!teacherId) return { studentUnreadCount: 0 };

      const response = await axios.get(
        `${BACKEND_URL}/chat/messages/${user.id}`,
        { params: { email: user.email } }
      );

      const unreadCount = response.data.filter(
        msg => msg.unread && msg.email !== user.email
      ).length;

      return { studentUnreadCount: unreadCount };
    } catch (error) {
      console.error('Error fetching student unread counts:', error);
      return { studentUnreadCount: 0 };
    }
  }
);

export const fetchLastMessageForRoom = createAsyncThunk(
  'chat/fetchLastMessageForRoom',
  async (roomId, { getState }) => {
    const { user } = getState().user.userInfo;
    if (!user) return { room: roomId, lastMessage: null };

    try {
      const response = await axios.get(
        `${BACKEND_URL}/chat/messages/${roomId}`,
        { params: { email: user.email } }
      );

      const messages = response.data;
      const lastMessage = messages[0] || null;

      if (!lastMessage) return { room: roomId, lastMessage: null };

      const isFile = lastMessage.userUrl || /^https?:\/\//.test(lastMessage.message);
      
      return {
        room: roomId,
        lastMessage: {
          content: isFile 
            ? extractFileName(lastMessage.userUrl || lastMessage.message)
            : lastMessage.message,
          timestamp: lastMessage.timestamp,
          type: isFile ? 'file' : 'text'
        }
      };
    } catch (error) {
      console.error(`Error fetching last message for room ${roomId}:`, error);
      return { room: roomId, lastMessage: null };
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    lastMessagesByRoom: {},
    unreadCountsByRoom: {},  // For teachers (student IDs as keys)
    studentUnreadCount: 0,    // For students (single number)
    loading: false,
    error: null,
  },
  reducers: {
    updateLastMessage: (state, action) => {
      const { room, message, currentUserEmail, currentUserRole } = action.payload;
      state.lastMessagesByRoom[room] = message;
      
      // Handle counts based on user role
      if (message.sender !== currentUserEmail && message.unread) {
        if (currentUserRole === 'teacher') {
          state.unreadCountsByRoom[room] = (state.unreadCountsByRoom[room] || 0) + 1;
        }
        // Students handled through separate thunk
      }
    },
    markRoomAsRead: (state, action) => {
      const { room, role } = action.payload;
      if (role === 'teacher') {
        state.unreadCountsByRoom[room] = 0;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesForTeacher.fulfilled, (state, action) => {
        state.lastMessagesByRoom = action.payload.lastMessages;
        state.unreadCountsByRoom = action.payload.unreadCounts;
      })
      .addCase(fetchLastMessageForRoom.fulfilled, (state, action) => {
        const { room, lastMessage } = action.payload;
        state.lastMessagesByRoom[room] = lastMessage;
      })
      .addCase(fetchUnreadCountsForStudent.fulfilled, (state, action) => {
        state.studentUnreadCount = action.payload.studentUnreadCount;
      });
  }
});

export const { updateLastMessage, markRoomAsRead } = chatSlice.actions;
export default chatSlice.reducer;