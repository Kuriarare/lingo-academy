const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const useChat = () => {
    const readChat = async (room, email) => {
        try {
          const response = await fetch(`${BACKEND_URL}/chat/read-chat/`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ room, email }),
          });
    
          if (response.ok) {
          } else {
            console.error('Error reading chat:', response.statusText);
          }
        } catch (error) {
          console.error('Error reading chat:', error);
        }
      }

    return { readChat };

};

export default useChat; 