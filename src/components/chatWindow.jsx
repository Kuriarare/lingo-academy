import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import send from "../assets/logos/send.png";
import { BsEmojiSmile } from "react-icons/bs"; // For emoji icon
import axios from "axios";
import { useSelector } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import EmojiPicker from "emoji-picker-react"; // Emoji picker library

const LOCAL_HOST = "http://localhost:8000";

const ChatWindow = ({ username, room, studentName, height}) => {
  const user = useSelector((state) => state.user.userInfo.user);
  const teacher = useSelector((state) => state.user.userInfo.user.teacher);

  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Ref to the PerfectScrollbar container
  const scrollContainerRef = useRef(null);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${LOCAL_HOST}/chat/messages/${room}`);
      setChatMessages(response.data.reverse());
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (username && room) {
      const socketInstance = io(`${LOCAL_HOST}`);
      setSocket(socketInstance);

      fetchMessages();
      socketInstance.emit("join", { username, room });

      socketInstance.on("chat", (data) => {
        setChatMessages((prevMessages) => [...prevMessages, data]);
      });

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [username, room]);

  useEffect(() => {
    // Scroll to the bottom when the component mounts or when chatMessages change
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendMessage = () => {
    if (message && room && socket) {
      const timestamp = new Date();
      socket.emit("chat", { username, room, message, timestamp });
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
    setMessage((prevMessage) => prevMessage + emojiObject.emoji); // Add the emoji to the message
    setShowEmojiPicker(false); // Close emoji picker after selecting
  };

  return (
    <div className="2xl:w-[340px] xl:w-[330px] md:w-[300px] w-full flex flex-col border ml-1 bg-white" style={{ height: height || '600px' }}>
      <h2 className="flex items-center justify-center h-12 shadow-sm text-white bg-[#273296]">
        {user.role === "user" ? (
          <>
            {teacher.name},{" "}
            {teacher.online === "online" ? (
              <>
                <span className="ml-[4px]">online</span>
                <span className="w-[0.62rem] h-[0.62rem] bg-green-500 inline-block rounded-full ml-1"></span>
              </>
            ) : (
              <>
                <span className="ml-[4px]">offline</span>
                <span className="w-[0.62rem] h-[0.62rem] bg-red-600 inline-block rounded-full ml-1"></span>
              </>
            )}
          </>
        ) : (
          studentName
        )}
      </h2>

      <PerfectScrollbar containerRef={(ref) => (scrollContainerRef.current = ref)} className="flex-1 overflow-hidden mb-4 p-3 relative">
        <ul>
          {chatMessages.map((msg, index) => {
            const showTimestamp =
              index === 0 ||
              new Date(msg.timestamp) - new Date(chatMessages[index - 1].timestamp) >
                3 * 60 * 1000;

            return (
              <div key={index} className="mb-2">
                {showTimestamp && (
                  <div className="text-center text-gray-500 text-[12px] my-2">
                    {formatTime(msg.timestamp)}
                  </div>
                )}
                <li
                  className={`flex ${
                    msg.username === username ? "justify-end" : "justify-start"
                  } mb-2 text-[15px]`}
                >
                  <div
                    className={`flex flex-col ${
                      msg.username === username ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl max-w-xs ${
                        msg.username === username
                          ? "bg-[#273296] text-white text-right 2xl:text-[15px] xl:text-[14px] md:text-[13px]"
                          : "bg-[#E8EBEE] text-blue-950 text-left 2xl:text-[15px] xl:text-[14px] md:text-[13px]"
                      }`}
                    >
                      <span>{msg.message}</span>
                    </div>
                  </div>
                </li>
              </div>
            );
          })}
          <div />
        </ul>
      </PerfectScrollbar>

      <div className="flex-shrink-0 flex items-center ml-1">
        <div className="relative flex-1 flex items-center">
          <button
            onClick={() => setShowEmojiPicker((prevState) => !prevState)}
            className="absolute left-2 bg-transparent"
          >
            <BsEmojiSmile className="text-[21px] text-slate-400" />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 pl-10 border rounded-full focus:outline-none bg-[#E8EBEE] text-blue-950 2xl:text-[15px] xl:text-[14px] md:text-[13px]"
          />
        </div>
        <button
          onClick={sendMessage}
          className="p-2 bg-[#273296] text-white rounded-full m-1"
        >
          <img src={send} alt="send" className="2xl:w-[24px] xl:w-[23px] md:w-[22px]" />
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-16 left-2 z-10">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
