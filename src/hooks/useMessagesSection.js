
const useMessagesSection = (setNewMessage, setSelectedChat, setShowChatList) => {
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowChatList(false);

    // Resetea el contador para la habitación seleccionada
    setNewMessage((prevMessages) => ({
      ...prevMessages,
      [chat.id]: 0,
    }));
  };

  const handleBackClick = () => {
    setSelectedChat(null); 
    setShowChatList(true); 
  };

  return {
    handleChatSelect, 
    handleBackClick
  };
};

export default useMessagesSection;
