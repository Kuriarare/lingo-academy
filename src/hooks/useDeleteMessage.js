import { useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useDeleteMessage = (setChatMessages, socket, room) => {

  const [openMessageId, setOpenMessageId] = useState(null);

    const handleEditMessage = (message) => {
        // Add your edit logic here
      };
      
      const handleDeleteMessage = async (messageId) => {
        try {
          // Delete message from backend
          const response = await fetch(`${BACKEND_URL}/chat/delete-global-chat/${messageId}`, {
            method: "DELETE",
          });
      
          if (!response.ok) {
            console.error("Failed to delete message:", response.statusText);
            return;
          }
      
          // Remove the message from the local state
          setChatMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== messageId)
          );
      
          // Notify other users in the room about message deletion (optional)
          socket.emit("deleteGlobalChat", { messageId, room });
        } catch (error) {
          console.error("Error deleting message:", error);
        }
      };
      
      const handleDeleteNormalMessage = async (messageId) => {
        try {
          // Delete message from backend
          const response = await fetch(`${BACKEND_URL}/chat/delete-normal-chat/${messageId}`, {
            method: "DELETE",
          });
      
          if (!response.ok) {
            console.error("Failed to delete message:", response.statusText);
            return;
          }
      
          // Remove the message from the local state
          setChatMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== messageId)
          );
      
          // Notify other users in the room about message deletion (optional)
          socket.emit("deleteNormalChat", { messageId, room });
        } catch (error) {
          console.error("Error deleting message:", error);
        }
      };
      
      
  const toggleOptionsMenu = (id) => {
    setOpenMessageId((prevId) => (prevId === id ? null : id));
  };

      

  return { handleDeleteMessage, handleDeleteNormalMessage, handleEditMessage, toggleOptionsMenu, openMessageId };
};
export default useDeleteMessage;