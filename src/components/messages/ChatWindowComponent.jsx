import { useEffect, useRef, useState } from "react";
import send from "../../assets/logos/send.png";
import { BsEmojiSmile, BsThreeDots } from "react-icons/bs";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import EmojiPicker from "emoji-picker-react";
import avatar from "../../assets/logos/avatar.jpg";
import MessageOptionsCard from "./MessageOptionsCard";
import useDeleteMessage from "../../hooks/useDeleteMessage.js";
import useChatWindow from "../../hooks/useChatWindow.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnreadMessages } from "../../redux/messageSlice";
import { useNavigate } from "react-router-dom";
import useGlobalChat from "../../hooks/useGlobalChat.js";
import useChatInputHandler from "../../hooks/useChatInputHandler.js";

const ChatWindowComponent = ({
  username,
  room,
  studentName,
  email,
  userUrl,
  userId,
  socket,
  onBackClick,
}) => {
  const scrollContainerRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userInfo.user);

  const { chatMessages, setChatMessages, sendMessage } = useGlobalChat(
    socket,
    room,
    username,
    email,
    userUrl
  );

  const [message, setMessage] = useState("");
  const {
    showEmojiPicker,
    setShowEmojiPicker,
    handleInput,
    handleEmojiClick,
  } = useChatInputHandler(message, setMessage);

  const handleSendMessage = () => {
    if (message.trim() === "") return;
    sendMessage(message);
    setMessage("");
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "auto";
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const {
    handleDeleteMessage,
    handleEditMessage,
    toggleOptionsMenu,
    openMessageId,
  } = useDeleteMessage(setChatMessages, socket, room);

  const { readMessages } = useChatWindow();

  useEffect(() => {
    if (user?.id && room) {
      readMessages(userId, room);
      dispatch(fetchUnreadMessages(user.id));
    }
  }, [room, user?.id, dispatch, userId, readMessages]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

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

  const handleJoinGeneralClass = () => {
    const userName = user.name;
    const email = user.email;
    let roomId = "";  
    if (user?.language === "english") {
      roomId = 'generalEnglishRoom'
      // alert(roomId);
    } else if (user?.language === "spanish") {
      roomId = 'generalSpanishRoom';
      // alert(roomId);
    } else if (user?.language === "polish") {
      roomId = 'generalPolishRoom';
      // alert(roomId);
    }
    navigate("/classroom", {
      state: { roomId, userName, email, fromMessage: true, },
    });
  }
  return (
    <div className="w-full h-[92vh] flex flex-col bg-gray-50 relative">
      {/* Header */}
      <div className="p-4 bg-white shadow-md z-10 flex items-center justify-between">
        <button onClick={onBackClick} className="lg:hidden p-2 text-gray-500 hover:text-purple-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-800 text-center flex-grow">
          {studentName.includes("General Chat ") ? (
            <>
              {studentName}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 inline-block ml-2 cursor-pointer text-purple-600 hover:text-purple-800 transition-colors"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                onClick={handleJoinGeneralClass}
              >
                <path d="M23 7l-7 4 7 4V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </>
          ) : (
            studentName
          )}
          <span className="block text-sm font-normal text-green-500 mt-1">
            Active now
          </span>
        </h2>
        <div className="lg:hidden w-8"></div> {/* This is a spacer to balance the header */}
      </div>

      {/* Messages */}
      <PerfectScrollbar
        containerRef={(ref) => (scrollContainerRef.current = ref)}
        className="flex-1 p-6"
      >
        <ul className="space-y-4">
          {chatMessages.map((msg, index) => {
            const showTimestamp =
              index === 0 ||
              new Date(msg.timestamp) -
                new Date(chatMessages[index - 1].timestamp) >
                3 * 60 * 1000;

            const showUsername =
              msg.email !== email &&
              (index === 0 || msg.email !== chatMessages[index - 1].email);

            const isSender = msg.email === email;
            const isFirstFromUser =
              index === 0 || msg.email !== chatMessages[index - 1].email;

            return (
              <div key={index}>
                {showTimestamp && (
                  <div className="text-center text-gray-500 text-xs my-4">
                    {formatTimestamp(msg.timestamp)}
                  </div>
                )}
                <li className={`flex items-end gap-3 ${isSender ? "justify-end" : "justify-start"}`}>
                  {!isSender && isFirstFromUser && (
                    <img
                      src={msg.userUrl || avatar}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full shadow-md"
                    />
                  )}
                  <div
                    className={`relative max-w-md p-4 rounded-2xl shadow-lg ${
                      isSender
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none"
                    } ${!isFirstFromUser && !isSender ? "ml-14" : ""}`}
                  >
                    {showUsername && (
                      <p className="text-sm font-bold mb-1">{msg.username}</p>
                    )}
                    <p className="text-sm" style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                      {msg.message}
                    </p>
                    {isSender && (
                      <div className="absolute top-1/2 -left-10 transform -translate-y-1/2">
                        <button
                          onClick={() => toggleOptionsMenu(msg.id)}
                          className="p-2 hover:bg-gray-200 rounded-full"
                        >
                          <BsThreeDots className="text-gray-500" />
                        </button>
                        {openMessageId === msg.id && (
                          <div className="absolute top-0 left-8 z-10">
                            <MessageOptionsCard
                              onEdit={() => handleEditMessage(msg)}
                              onDelete={() => handleDeleteMessage(msg.id)}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              </div>
            );
          })}
        </ul>
      </PerfectScrollbar>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="relative flex items-center">
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="p-2 text-gray-500 hover:text-purple-600"
          >
            <BsEmojiSmile size={24} />
          </button>
          <textarea
            placeholder="Type a message..."
            value={message}
            onChange={handleInput}
            onClick={() => dispatch(fetchUnreadMessages(user.id))}
            onKeyDown={handleKeyDown}
            className="w-full p-3 pl-12 border-none rounded-full focus:outline-none bg-gray-100 text-gray-800 resize-none text-sm"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            className="ml-3 p-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full shadow-lg hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <img src={send} alt="send" className="w-6 h-6" />
          </button>
        </div>
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-4 z-10">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindowComponent;
