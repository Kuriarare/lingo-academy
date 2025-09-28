import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedChat } from '../redux/chatSlice';
import { useDeleteMessage } from './useDeleteMessage';
import { useArchivedMessages } from './useArchivedMessages';

const useMessageOptions = (selectedChat, setMessages) => {
  const dispatch = useDispatch();
  const { deleteMessage } = useDeleteMessage();
  const { archiveMessages } = useArchivedMessages();
  const [showOptions, setShowOptions] = useState(null);

  const handleShowOptions = (messageId) => {
    setShowOptions(showOptions === messageId ? null : messageId);
  };

  const handleDelete = async (messageId) => {
    await deleteMessage(messageId);
    setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    setShowOptions(null);
  };

  const handleArchive = async () => {
    await archiveMessages(selectedChat._id);
    dispatch(setSelectedChat(null));
  };

  return {
    showOptions,
    handleShowOptions,
    handleDelete,
    handleArchive,
  };
};

export default useMessageOptions;