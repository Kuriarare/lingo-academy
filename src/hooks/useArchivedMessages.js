import { useState, useEffect } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useArchivedMessages = (room, chatMessages) => {
  const [archivedMessages, setArchivedMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchArchivedMessages = async () => {
    if (!hasMore) return;
    try {
      const response = await fetch(
        `${BACKEND_URL}/chat/archived-messages/${room}?page=${page}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch archived messages");
      }
      const data = await response.json();
      if (data.length > 0) {
        setArchivedMessages((prev) => [...data, ...prev]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching archived messages:", error);
    }
  };

  useEffect(() => {
    if (chatMessages) {
      const combined = [...archivedMessages, ...chatMessages].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setAllMessages(combined);
    }
  }, [chatMessages, archivedMessages]);

  return { allMessages, fetchArchivedMessages, hasMore };
};

export default useArchivedMessages;