import { useState } from "react";

const useChatInput = (sendMessage) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const resetTextarea = () => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "auto";
    }
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(message, setMessage, resetTextarea);
      resetTextarea();
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return {
    message,
    setMessage,
    showEmojiPicker,
    setShowEmojiPicker,
    handleInput,
    handleKeyDown,
    handleEmojiClick,
    resetTextarea,
  };
};

export default useChatInput;