import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import send from "../../assets/logos/send.png";
import { BsEmojiSmile, BsThreeDots } from "react-icons/bs";
import axios from "axios";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import EmojiPicker from "emoji-picker-react";
import avatar from "../../assets/logos/avatar.jpg";
import MessageOptionsCard from "./MessageOptionsCard";
import useDeleteMessage from "../../hooks/useDeleteMessage";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL


const CallChatWindow = ({
  username,
  room,
  studentName,
  email,
  userUrl,
}) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const scrollContainerRef = useRef(null);
  const { handleDeleteMessage, handleEditMessage, toggleOptionsMenu, openMessageId } = useDeleteMessage(setChatMessages, socket, room);


  const fetchMessages = async () => {
    try {
      // Fetch messages based on the room and email to ensure proper user identification
      const response = await axios.get(`${BACKEND_URL}/chat/global-chats/${room}`, {
        params: { email }, // Passing email to the backend to fetch the right data
      });

      // Reverse the messages to show the latest on top
      setChatMessages(response.data.reverse());
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (socket && room) {
      socket.on('globalChatDeleted', (data) => {
        // Remove the deleted message from the local state
        setChatMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== data.messageId)
        );
      });
  
      return () => {
        socket.off('globalChatDeleted');  // Clean up the event listener on component unmount
      };
    }
  }, [socket, room]);  // Only re-run if 

  useEffect(() => {
    if (username && room) {
      const socketInstance = io(`${BACKEND_URL}`);
      setSocket(socketInstance);

      fetchMessages();
      socketInstance.emit("join", { username, room });

      socketInstance.on("globalChat", (data) => {
        setChatMessages((prevMessages) => [...prevMessages, data]);
      });

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [username, room]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendMessage = () => {
    if (message && room && socket) {
      const timestamp = new Date();
      const messageData = {
        username,
        room,
        email,
        message,
        timestamp,
      };
      if (userUrl) {
        messageData.userUrl = userUrl;
      }
      socket.emit("globalChat", messageData);
      setMessage("");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      // If it's today, show the time
      return `${date.toLocaleTimeString()}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      // If it's yesterday, show "Yesterday"
      return `Yesterday at ${date.toLocaleTimeString()}`;
    } else {
      // If it's earlier, show the full date and time
      return `${date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })} at ${date.toLocaleTimeString()}`;
    }
  };

  return (
    <div className="2xl:w-[340px] xl:w-[330px] md:w-[300px] h-[100vh] flex flex-col bg-gray-50 border-l border-gray-200">
      {/* Header */}
      <div className="p-4 bg-white shadow-md z-10">
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Group Chat
          <span className="block text-sm font-normal text-green-500 mt-1">
            Live
          </span>
        </h2>
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
                    className={`relative max-w-xs p-4 rounded-2xl shadow-lg ${
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
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-3 pl-12 border-none rounded-full focus:outline-none bg-gray-100 text-gray-800 text-sm"
          />
          <button
            onClick={sendMessage}
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

export default CallChatWindow;
