import { useState, useEffect, useRef } from "react";
import send from "../../assets/logos/send.png";
import { BsEmojiSmile, BsThreeDots } from "react-icons/bs";
import axios from "axios";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import EmojiPicker from "emoji-picker-react";
import avatar from "../../assets/logos/avatar.jpg";
import MessageOptionsCard from "./MessageOptionsCard";
import useDeleteMessage from "../../hooks/useDeleteMessage";
import useChatWindow from "../../hooks/useChatWindow";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnreadMessages } from "../../redux/messageSlice";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ChatWindowComponent = ({
  username,
  room,
  studentName,
  email,
  userUrl,
  userId,
  socket,
}) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollContainerRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userInfo.user);
  console.log("user", user);

  const {
    handleDeleteMessage,
    handleEditMessage,
    toggleOptionsMenu,
    openMessageId,
  } = useDeleteMessage(setChatMessages, socket, room);

  const { readMessages } = useChatWindow();

  const fetchMessages = async () => {
    try {
      // Fetch messages based on the room and email to ensure proper user identification
      const response = await axios.get(
        `${BACKEND_URL}/chat/global-chats/${room}`,
        {
          params: { email }, // Passing email to the backend to fetch the right data
        }
      );

      // Reverse the messages to show the latest on top
      setChatMessages(response.data.reverse());
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (socket && room && user?.id) {
      // Emit join event to the socket
      socket.emit("join", { username, room });

      // Fetch initial messages for the room
      fetchMessages();
      // readMessages(userId, room);

      // // Dispatch to update the unread messages for the user
      // dispatch(fetchUnreadMessages(user.id));

      // Listen for incoming global chat messages
      const handleGlobalChat = (data) => {
        setChatMessages((prevMessages) => [...prevMessages, data]);
      };
      socket.on("globalChat", handleGlobalChat);

      // Cleanup: Remove listeners and leave the room
      return () => {
        socket.off("globalChat", handleGlobalChat);
      };
    }
  }, [room, socket, user, dispatch, username, userId]);

  useEffect(() => {
    if (user?.id && room) {
      // Primero, marca los mensajes como leídos
      readMessages(userId, room);

      // Luego, dispara el dispatch de mensajes no leídos
      dispatch(fetchUnreadMessages(user.id));
    }
  }, [room, user?.id, dispatch, userId]); // Añadir dependencias necesarias

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
      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

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
    <div className=" chat-pattern w-[100%] h-[92vh] flex flex-col bg-white relative">
      <div className="2xl:p-[18.5px] p-[19px] bg-gradient-to-r from-[#9E2FD0] to-[#B15FE3]">
        <h2 className="text-lg font-semibold text-white tracking-tight text-center">
          {studentName.includes("General Chat ") ? (
            <>
              {studentName}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 inline-block ml-2 cursor-pointer hover:text-purple-300 transition-colors"
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
          <span className="text-purple-100 block text-sm font-normal mt-1">
            Active now
          </span>
        </h2>
      </div>
      <PerfectScrollbar
        containerRef={(ref) => (scrollContainerRef.current = ref)}
        className="flex-1 overflow-hidden mb-4 p-3 pl-10"
      >
        <div className="w-full flex justify-center ">
          <div className="max-w-[800px] w-full">
            <ul className="w-full">
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

                // Check if it's the first message from this user in a sequence
                const isFirstFromUser =
                  index === 0 || msg.email !== chatMessages[index - 1].email;

                return (
                  <div key={index} className="mb-1">
                    {showTimestamp && (
                      <div className="text-center  text-gray-800 text-[12px] my-2">
                        {formatTimestamp(msg.timestamp)}
                      </div>
                    )}
                    <li
                      className={`flex ${
                        isSender ? "justify-end" : "justify-start"
                      } text-[15px] ${isFirstFromUser ? "mt-4" : ""}`}
                    >
                      <div
                        className={`flex flex-col relative ${
                          isSender ? "items-end" : "items-start"
                        }`}
                      >
                        <div className="absolute left-[-32px] top-[-10px]">
                          {/* Render image from URL only if it's available */}
                          {msg.userUrl && !isSender && isFirstFromUser && (
                            <div className="flex items-start space-x-2">
                              <div className="flex items-center bg-[#f0f0f0] rounded-[16px] max-w-[250px]">
                                <img
                                  src={msg.userUrl}
                                  alt="URL Link"
                                  className="w-[30px] h-[30px] object-cover rounded-full"
                                />
                              </div>
                            </div>
                          )}

                          {/* Render Avatar if no URL and first message from user */}
                          {!msg.userUrl && !isSender && isFirstFromUser && (
                            <img
                              src={avatar}
                              alt="Avatar"
                              className="w-[30px] h-[30px] rounded-full"
                            />
                          )}
                        </div>
                        <div
                          className={`relative p-3 max-w-lg ${isSender
                            ? "bg-gradient-to-r from-[#9E2FD0] to-[#B15FE3] text-white text-left rounded-l-lg rounded-tr-lg rounded-br-none"
                            : "bg-[#E8EBEE] text-blue-950 text-left rounded-r-lg rounded-bl-lg rounded-tl-none"
                        }`}
                        >
                          {showUsername && (
                            <div className="text-xs font-bold mb-1">
                              {msg.username}
                            </div>
                          )}

                          {/* Dots Menu (only for Sender) */}
                          {isSender && (
                            <div className="absolute top-1/2 left-[-30px] transform -translate-y-1/2 z-20">
                              <button
                                onClick={() => toggleOptionsMenu(msg.id)}
                                className="p-1 hover:bg-gray-200 rounded-full"
                              >
                                <BsThreeDots className="text-gray-500" />
                              </button>

                              {/* Render Options Card if visible */}
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

                          {/* Message Content */}
                          <span
                            style={{
                              whiteSpace: "pre-wrap",
                              wordWrap: "break-word",
                              overflowWrap: "break-word",
                              wordBreak: "break-word",
                            }}
                          >
                            {msg.message}
                          </span>
                        </div>
                      </div>
                    </li>
                  </div>
                );
              })}
            </ul>
          </div>
        </div>
      </PerfectScrollbar>
      <div className="flex-shrink-0 flex items-center ml-1">
        <div className="relative flex-1 flex items-center">
          <button
            onClick={() => setShowEmojiPicker((prevState) => !prevState)}
            className="absolute left-2 bg-transparent"
          >
            <BsEmojiSmile className="text-[21px] text-slate-400" />
          </button>
          <textarea
            placeholder="Type a message..."
            value={message}
            onChange={handleInput}
            onClick={() => dispatch(user.id)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 pl-10 border rounded-xl focus:outline-none bg-[#E8EBEE] text-blue-950 resize-none overflow-hidden 2xl:text-[15px] xl:text-[14px] md:text-[13px]"
            rows={1}
          />
        </div>
        <button
          onClick={sendMessage}
          className="p-2 bg-gradient-to-r from-[#9E2FD0] to-[#B15FE3] text-white rounded-full m-1"
        >
          <img
            src={send}
            alt="send"
            className="2xl:w-[24px] xl:w-[23px] w-[22px]"
          />
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-12 left-[200px] z-10 transform -translate-x-1/2">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindowComponent;
