import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessagesForTeacher,
  fetchUnreadCountsForStudent,
} from "../redux/chatSlice";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const useChatWindow = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.user.userInfo.user?.role);


  const formatTimestamp = useCallback((timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `${date.toLocaleTimeString()}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString()}`;
    } else {
      return `${date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })} at ${date.toLocaleTimeString()}`;
    }
  }, []);

  const readMessages = useCallback(async (userId, room) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/chat/delete-unread-global-messages/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, room }),
        }
      );

      if (response.ok) {
      } else {
        console.error("Error reading messages:", response.statusText);
      }
    } catch (error) {
      console.error("Error reading messages:", error);
    }
  }, []);

  const readChat = useCallback(async (room, email) => {
    try {
      const response = await fetch(`${BACKEND_URL}/chat/read-chat/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ room, email }),
      });
  
      if (response.ok) {
        if (userRole === "teacher") {
          dispatch(fetchMessagesForTeacher());
        } else if (userRole === "user") {
          dispatch(fetchUnreadCountsForStudent());
        }
      } else {
        console.error("Error reading chat:", response.statusText);
      }
    } catch (error) {
      console.error("Error reading chat:", error);
    }
  }, [dispatch, userRole]);
  

  return useMemo(
    () => ({ formatTimestamp, readMessages, readChat }),
    [formatTimestamp, readMessages, readChat]
  );
};

export default useChatWindow;
