import { useState } from 'react';

const useChatInputHandler = (message, setMessage) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleInput = (e) => {
    setMessage(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return {
    showEmojiPicker,
    setShowEmojiPicker,
    handleInput,
    handleEmojiClick,
  };
};

export default useChatInputHandler;