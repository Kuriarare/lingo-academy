const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const useChatWindow = () => {
  const formatTimestamp = (timestamp) => {
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
  };
  
  const readMessages = async (userId, room) => {
    try { 
      const response = await fetch(`${BACKEND_URL}/chat/delete-unread-global-messages/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, room }),
      });
  
      if (response.ok) {
        console.log(`Messages read in room: ${room}`);
      } else {
        console.error('Error reading messages:', response.statusText);
      }
    } catch (error) {
      console.error('Error reading messages:', error);
    }
  };
  

 return { formatTimestamp, readMessages };
};

export default useChatWindow;
