import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessagesForTeacher,
  fetchUnreadCountsForStudent,
} from "../redux/chatSlice";
import useChatWindow from "./useChatWindow";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useSocketManager = (room, username, email) => {
  const [socket, setSocket] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const user = useSelector((state) => state.user.userInfo.user);
  const dispatch = useDispatch();
  const { readChat } = useChatWindow(room, email);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/chat/messages/${room}`, {
        params: { email },
      });
      setChatMessages(response.data.reverse());
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (socket && room) {
      socket.on("normalChatDeleted", (data) => {
        setChatMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== data.messageId)
        );
      });

      return () => {
        socket.off("normalChatDeleted");
      };
    }
  }, [socket, room]);

  useEffect(() => {
    let socketInstance;

    const handleNewChat = () => {
      if (user?.role === "teacher") {
        dispatch(fetchMessagesForTeacher());
      } else if (user?.role === "user") {
        dispatch(fetchUnreadCountsForStudent());
      }
    };

    if (username && room) {
      socketInstance = io(`${BACKEND_URL}`);
      setSocket(socketInstance);

      const initializeChat = async () => {
        await fetchMessages();
        await readChat(room, email);
      };
      initializeChat();

      socketInstance.emit("join", { username, room });

      socketInstance.on("chat", (data) => {
        setChatMessages((prevMessages) => [...prevMessages, data]);
      });

      socketInstance.on("newChat", () => {
        readChat(room, email);
        handleNewChat();
      });

      socketInstance.on("newChat", handleNewChat);
    }

    return () => {
      if (socketInstance) {
        socketInstance.off("chat");
        socketInstance.off("newChat");
        socketInstance.off("newChat", handleNewChat);
        socketInstance.disconnect();
      }
    };
  }, [username, room, dispatch, email]);

  return { socket, chatMessages, setChatMessages };
};

export default useSocketManager;