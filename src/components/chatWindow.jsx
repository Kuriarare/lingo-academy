import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import send from "../assets/logos/send.png";
import { BsEmojiSmile, BsPaperclip } from "react-icons/bs";
import axios from "axios";
import { useSelector } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import EmojiPicker from "emoji-picker-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL


const ChatWindow = ({ username, email, room, studentName, height }) => {
  const user = useSelector((state) => state.user.userInfo.user);
  const teacher = useSelector((state) => state.user.userInfo.user.teacher);

  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState(""); // Estado para almacenar la URL del archivo

  const scrollContainerRef = useRef(null);

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
          className={`${isSender ? "text-white" : "text-blue-600 underline"}`}
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
    if (username && room) {
      const socketInstance = io(`${BACKEND_URL}`);
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
      setMessage(""); // Limpiar el mensaje
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
      setFileUrl(null); // Limpiar la URL del archivo
    }
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", "user-id"); // Pasa el ID del usuario, si es necesario

    try {
      // Enviar el archivo al backend (localhost:8000/upload/chat-upload)
      const response = await fetch(
        `${BACKEND_URL}/upload/chat-upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error uploading file");
      }

      // Obtener la URL del archivo cargado
      const data = await response.json();
      const fileUrl = data.fileUrl; // La URL que el backend devuelve
      console.log("File uploaded:", fileUrl);
      sendFileMessage(fileUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
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

  const renderFileMessage = (fileUrl, isSender) => {
    const fileExtension = fileUrl.split(".").pop().toLowerCase();

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
      // Renderiza un enlace para visualizar PDF
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${isSender ? "text-white" : "text-blue-600 underline"}`}
        >
          Download PDF
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
    } else {
      // Enlace de descarga para otros tipos de archivos
      return (
        <a
          href={fileUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className={`${isSender ? "text-white" : "text-blue-600 underline"}`}
        >
          Descargar archivo
        </a>
      );
    }
  };

  return (
    <div
      className="chat-pattern 2xl:w-[340px] xl:w-[330px]  w-full flex flex-col border ml-1 bg-white"
      style={{ height: height || "600px" }}
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
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl max-w-xs ${
                        isSender
                          ? "bg-[#273296] text-white text-right rounded-l-lg rounded-tr-lg rounded-br-none"
                          : "bg-[#E8EBEE] text-blue-950 text-left rounded-r-lg rounded-bl-lg rounded-tl-none"
                      }`}
                    >
                      <span>
                        {isFileMessage
                          ? renderFileMessage(msg.message, isSender)
                          : formatMessageWithLinks(msg.message, isSender)}
                      </span>
                    </div>
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
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 pl-10 border rounded-full focus:outline-none bg-[#E8EBEE] text-blue-950 2xl:text-[15px] xl:text-[14px] md:text-[13px]"
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
