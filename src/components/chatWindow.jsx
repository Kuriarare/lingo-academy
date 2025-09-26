import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import send from "../assets/logos/send.png";
import { BsEmojiSmile, BsPaperclip, BsThreeDots } from "react-icons/bs";
import axios from "axios";
import { useSelector } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import EmojiPicker from "emoji-picker-react";
import useDeleteMessage from "../hooks/useDeleteMessage";
import MessageOptionsCard from "./messages/MessageOptionsCard";
import { FiX } from "react-icons/fi";
import { useDispatch } from "react-redux";
import {
  fetchLastMessageForRoom,
  fetchMessagesForTeacher,
  fetchUnreadCountsForStudent,
} from "../redux/chatSlice";
import useChatWindow from "../hooks/useChatWindow";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ChatWindow = ({
  username,
  email,
  room,
  studentName,
  height,
  isChatOpen,
  setIsChatOpen,
  setShowChat,
}) => {
  const user = useSelector((state) => state.user.userInfo.user);
  const teacher = useSelector((state) => state.user.userInfo.user.teacher);
  const dispatch = useDispatch();

  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState(""); // Estado para almacenar la URL del archivo
  // const dispatch = useDispatch();

  const scrollContainerRef = useRef(null);
  const {
    handleDeleteNormalMessage,
    handleEditMessage,
    toggleOptionsMenu,
    openMessageId,
  } = useDeleteMessage(setChatMessages, socket, room);

  const { readChat } = useChatWindow(room, email);

  // Función para detectar links y envolverlos en etiquetas <a>
  const formatMessageWithLinks = (text, isSender) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={`${isSender ? "text-white " : "text-blue-600 underline"}`}
        >
          {part}
        </a>
      ) : (
        part
      )
    );
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

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/chat/messages/${room}`, {
        params: { email },
      });
      setChatMessages(response.data.reverse());
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (socket && room) {
      socket.on("normalChatDeleted", (data) => {
        console.log(`Message with ID ${data.messageId} was deleted`);

        // Remove the deleted message from the local state
        setChatMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== data.messageId)
        );
      });

      return () => {
        socket.off("normalChatDeleted"); // Clean up the event listener on component unmount
      };
    }
  }, [socket, room]); // Only re-run if

  useEffect(() => {
    let socketInstance;
    
    const handleNewChat = () => {
      // Use current user from Redux store directly
      if (user?.role === "teacher") {
        dispatch(fetchMessagesForTeacher());
      } else if (user?.role === "user") {
        dispatch(fetchUnreadCountsForStudent());
      }
    };
  
    if (username && room) {
      socketInstance = io(`${BACKEND_URL}`);
      setSocket(socketInstance);
  
      // Initial setup
      const initializeChat = async () => {
        await fetchMessages();
        await readChat(room, email);
      };
      initializeChat();
  
      // Event listeners
      socketInstance.emit("join", { username, room });
      
      socketInstance.on("chat", (data) => {
        setChatMessages((prevMessages) => [...prevMessages, data]);
      });
  
      socketInstance.on("newChat", () => {
        readChat(room, email);
        handleNewChat(); // Unified handler
      });
  
      // Add unified chat handler
      socketInstance.on("newChat", handleNewChat);
    }
  
    return () => {
      if (socketInstance) {
        // Clean up all listeners
        socketInstance.off("chat");
        socketInstance.off("newChat");
        socketInstance.off("newChat", handleNewChat);
        socketInstance.disconnect();
      }
    };
  }, [username, room, dispatch, email]); // Added missing email dependency

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendMessage = async () => {
    if (message && room && socket) {
      // Si hay un mensaje de texto, enviar el mensaje como de costumbre
      const timestamp = new Date();
      socket.emit("chat", { username, email, room, message, timestamp });
      setMessage("");
      resetTextarea();
    } else {
      // Si no hay mensaje de texto, ejecutar la función para cargar el archivo
      await handleFileChange(); // Esperamos a que se cargue el archivo

      // Después de la carga, obtener la URL y enviarla como mensaje
      if (fileUrl) {
        const timestamp = new Date();
        socket.emit("chat", {
          username,
          email,
          room,
          message: fileUrl,
          timestamp,
        });
        // dispatch(fetchLastMessageForRoom(room));
      }
    }
  };

  const sendFileMessage = (fileUrl) => {
    if (fileUrl && room && socket) {
      const timestamp = new Date();
      socket.emit("chat", {
        username,
        email,
        room,
        message: fileUrl,
        timestamp,
      });
      setFileUrl(null);
      // dispatch(fetchLastMessageForRoom(room));
    }
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", "user-id"); // Pasa el ID del usuario, si es necesario

    // Log FormData to check its contents
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await fetch(`${BACKEND_URL}/upload/chat-upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error uploading file");
      }

      const data = await response.json();
      const fileUrl = data.fileUrl;
      console.log("File uploaded:", fileUrl);
      sendFileMessage(fileUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
      resetTextarea();
    }
  };

  const resetTextarea = () => {
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.style.height = "auto"; // Reset to initial height
    }
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const cleanFileName = (fileUrl) => {
    // Extract the file name (without extension)
    let fileName = fileUrl.split("/").pop().split(".")[0];

    // Remove the numbers and dashes at the start of the filename
    fileName = fileName.replace(/^\d+-|^\d+$/g, "");

    // Remove accents from the file name
    fileName = removeAccents(fileName);

    // Remove extra spaces and dashes
    fileName = fileName.replace(/[-\s]+/g, " ").trim();

    return fileName;
  };

  const renderFileMessage = (fileUrl, isSender) => {
    const fileExtension = fileUrl.split(".").pop().toLowerCase();
    const fileName = cleanFileName(fileUrl);

    if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
      // Renderiza una imagen
      return (
        <img
          src={fileUrl}
          alt="shared file"
          className="max-w-full max-h-40 cursor-pointer"
          onClick={() => window.open(fileUrl, "_blank")}
        />
      );
    } else if (fileExtension === "pdf") {
      // Renderiza el nombre del archivo en lugar de "Download PDF"
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${isSender ? "text-white underline" : "text-blue-600 underline"}`}
        >
          {fileName}.pdf
        </a>
      );
    } else if (["mp3", "wav"].includes(fileExtension)) {
      // Renderiza un reproductor de audio
      return (
        <audio controls className="max-w-full">
          <source src={fileUrl} type={`audio/${fileExtension}`} />
          Tu navegador no soporta el elemento de audio.
        </audio>
      );
    } else if (["docx", "pptx", "xlsx", "txt", "odt"].includes(fileExtension)) {
      // Handle document and PowerPoint files (Word, Excel, PowerPoint, etc.)
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${isSender ? "text-white underline" : "text-blue-600 underline"}`}
        >
          {fileName}.{fileExtension}
        </a>
      );
    } else {
      // Enlace de descarga para otros tipos de archivos
      return (
        <a
          href={fileUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className={`${isSender ? "text-white underline" : "text-blue-600 underline"}`}
        >
          {fileUrl}
        </a>
      );
    }
  };

  const handleInput = (e) => {
    setMessage(e.target.value);

    // Adjust the height of the textarea dynamically
    const textarea = e.target;
    textarea.style.height = "auto"; 
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div
      className="chat-pattern 2xl:w-[350px] xl:w-[330px]  w-full flex flex-col border  "
      style={{ height: height || "630px" }}
    >
      <h2 className="flex items-center justify-center h-12 shadow-sm text-white bg-[#273296]">
        {user.role === "user" ? (
          <>
            {teacher ? teacher.name : "No teacher yet"},
            {teacher?.online === "online" ? (
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

        {isChatOpen && (
          <button
            onClick={() => {
              setIsChatOpen((prevState) => !prevState);
              setShowChat((prevState) => !prevState);
            }}
            className="absolute right-4"
          >
            <FiX className="text-white text-[22px]" />
          </button>
        )}
      </h2>

      <PerfectScrollbar
        containerRef={(ref) => (scrollContainerRef.current = ref)}
        className="flex-1 overflow-hidden mb-4 p-3 relative"
      >
        <ul>
          {chatMessages.map((msg, index) => {
            const showTimestamp =
              index === 0 ||
              new Date(msg.timestamp) -
                new Date(chatMessages[index - 1].timestamp) >
                3 * 60 * 1000;
            const isSender = msg.email === email; // Identifying the sender using the email
            const isFileMessage = msg.message.startsWith("http");

            return (
              <div key={index} className="mb-2">
                {showTimestamp && (
                  <div className="text-center text-gray-500 text-[12px] my-2">
                    {formatTimestamp(msg.timestamp)}
                  </div>
                )}
                <li
                  className={`flex ${
                    isSender ? "justify-end" : "justify-start"
                  } mb-2 text-[15px]`}
                >
                  <div
                    className={`flex flex-col ${
                      isSender ? "items-end" : "items-start"
                    } relative`}
                  >
                    {/* Dots Menu (only for Sender) */}
                    {isSender && (
                      <div
                        className="absolute left-0 top-[-15px] flex items-center z-20"
                        onClick={() => toggleOptionsMenu(msg.id)} // Ensure toggle is triggered on click
                      >
                        {/* Dots button */}
                        <button className="p-1 hover:bg-gray-200 rounded-full">
                          <BsThreeDots className="text-gray-500" />
                        </button>
                      </div>
                    )}

                    {/* Message content */}
                    <div
                      className={`p-2 rounded-xl ${
                        isSender
                          ? "bg-[#273296] text-white text-left rounded-l-lg rounded-tr-lg rounded-br-none"
                          : "bg-[#E8EBEE] text-blue-950 text-left rounded-r-lg rounded-bl-lg rounded-tl-none"
                      }`}
                      style={{
                        whiteSpace: "pre-wrap", // Keeps spaces and line breaks intact
                        wordWrap: "break-word", // Ensures long words wrap
                        overflowWrap: "break-word", // Breaks long words or URLs
                        wordBreak: "break-word", // Breaks long words or URLs (for extra security)
                      }}
                    >
                      <span>
                        {isFileMessage ? (
                          renderFileMessage(msg.message, isSender)
                        ) : (
                          <>
                            {/* Render links in messages */}
                            {formatMessageWithLinks(msg.message, isSender)}
                          </>
                        )}
                      </span>
                    </div>

                    {/* Options card that appears on click */}
                    {openMessageId === msg.id && (
                      <div className="absolute top-2 left-0 z-30">
                        <MessageOptionsCard
                          onEdit={() => handleEditMessage(msg)}
                          onDelete={() => handleDeleteNormalMessage(msg.id)}
                        />
                      </div>
                    )}
                  </div>
                </li>
              </div>
            );
          })}
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
          <textarea
            placeholder="Type a message..."
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            className="w-full p-2 pl-10 border rounded-xl focus:outline-none bg-[#E8EBEE] text-blue-950 resize-none overflow-hidden 2xl:text-[15px] xl:text-[14px] md:text-[13px]"
            rows={1} // Start with 1 row
          />
          <input
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute opacity-0 cursor-pointer"
            id="fileInput"
            style={{ pointerEvents: "none" }}
          />
          <label
            htmlFor="fileInput"
            className="absolute right-2 cursor-pointer"
          >
            <BsPaperclip className="text-[21px] text-slate-400" />
          </label>
        </div>
        <button
          onClick={sendMessage}
          className="p-2 bg-[#273296] text-white rounded-full m-1"
        >
          <img
            src={send}
            alt="send"
            className="2xl:w-[24px] xl:w-[23px] w-[22px]"
          />
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
