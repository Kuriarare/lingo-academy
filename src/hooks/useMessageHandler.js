import { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useMessageHandler = (socket, room, username, email) => {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const sendMessage = async (message, setMessage, resetTextarea) => {
    if (message && room && socket) {
      const timestamp = new Date();
      socket.emit("chat", { username, email, room, message, timestamp });
      setMessage("");
      resetTextarea();
    } else {
      await handleFileChange();
      if (fileUrl) {
        const timestamp = new Date();
        socket.emit("chat", {
          username,
          email,
          room,
          message: fileUrl,
          timestamp,
        });
      }
    }
  };

  const sendFileMessage = (fileUrl) => {
    if (fileUrl && room && socket) {
      const timestamp = new Date();
      socket.emit("chat", {
        username,
        email,
        room,
        message: fileUrl,
        timestamp,
      });
      setFileUrl(null);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", "user-id");

    try {
      const response = await fetch(`${BACKEND_URL}/upload/chat-upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error uploading file");
      }

      const data = await response.json();
      const uploadedFileUrl = data.fileUrl;
      sendFileMessage(uploadedFileUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return { uploading, sendMessage, handleFileChange };
};

export default useMessageHandler;