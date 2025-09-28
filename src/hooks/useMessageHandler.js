import { useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useMessageHandler = (socket, room, username, email) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  const sendMessage = (message, setMessage, resetTextarea) => {
    if (message.trim() && room && socket) {
      const timestamp = new Date();
      socket.emit("chat", { username, email, room, message, timestamp });
      setMessage("");
      resetTextarea();
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

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

      if (uploadedFileUrl && room && socket) {
        const timestamp = new Date();
        socket.emit("chat", {
          username,
          email,
          room,
          message: uploadedFileUrl,
          timestamp,
        });
      }
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      console.error("Error uploading file:", err);
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  return {
    uploading,
    error,
    file,
    sendMessage,
    handleFileChange,
    uploadFile,
    clearFile,
  };
};

export default useMessageHandler;