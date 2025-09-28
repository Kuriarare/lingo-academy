import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useGlobalChat = (socket, room, username, email, userUrl) => {
  const [chatMessages, setChatMessages] = useState([]);

  const fetchMessages = useCallback(async () => {
    if (!room || !email) return;
    try {
      const response = await axios.get(
        `${BACKEND_URL}/chat/global-chats/${room}`,
        {
          params: { email },
        }
      );
      setChatMessages(response.data.reverse());
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [room, email]);

  useEffect(() => {
    if (socket && room && username) {
      socket.emit('join', { username, room });
      fetchMessages();

      const handleGlobalChat = (data) => {
        setChatMessages((prevMessages) => [...prevMessages, data]);
      };
      socket.on('globalChat', handleGlobalChat);

      return () => {
        socket.off('globalChat', handleGlobalChat);
      };
    }
  }, [room, socket, username, fetchMessages]);

  const sendMessage = (message) => {
    if (message && room && socket) {
      const timestamp = new Date();
      const messageData = {
        username,
        room,
        email,
        message,
        timestamp,
      };
      if (userUrl) {
        messageData.userUrl = userUrl;
      }
      socket.emit('globalChat', messageData);
    }
  };

  return { chatMessages, setChatMessages, sendMessage };
};

export default useGlobalChat;