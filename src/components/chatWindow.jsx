import { useEffect, useRef, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile, BsPaperclip, BsThreeDots } from "react-icons/bs";
import { FiX } from "react-icons/fi";
import send from "../assets/logos/send.png";
import useDeleteMessage from "../hooks/useDeleteMessage";
import useSocketManager from "../hooks/useSocketManager";
import useMessageHandler from "../hooks/useMessageHandler";
import useMessageFormatter from "../hooks/useMessageFormatter.jsx";
import useChatInput from "../hooks/useChatInput";
import useArchivedMessages from "../hooks/useArchivedMessages";
import MessageOptionsCard from "./messages/MessageOptionsCard";

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
  const scrollContainerRef = useRef(null);
  const { socket, chatMessages, setChatMessages } = useSocketManager(
    room,
    username,
    email
  );
  const { allMessages, fetchArchivedMessages, hasMore } = useArchivedMessages(
    room,
    chatMessages
  );
  const { uploading, sendMessage, handleFileChange } = useMessageHandler(
    socket,
    room,
    username,
    email
  );
  const { formatMessageWithLinks, formatTimestamp, renderFileMessage } =
    useMessageFormatter();
  const {
    message,
    setMessage,
    showEmojiPicker,
    setShowEmojiPicker,
    handleInput,
    handleKeyDown,
    handleEmojiClick,
    resetTextarea,
  } = useChatInput((message, setMessage, resetTextarea) =>
    sendMessage(message, setMessage, resetTextarea)
  );
  const {
    handleDeleteNormalMessage,
    handleEditMessage,
    toggleOptionsMenu,
    openMessageId,
  } = useDeleteMessage(setChatMessages, socket, room);

  const isArchivedFetch = useRef(false);
  const prevScrollHeight = useRef(null);

  const handleLoadMore = async () => {
    if (scrollContainerRef.current) {
      prevScrollHeight.current = scrollContainerRef.current.scrollHeight;
    }
    isArchivedFetch.current = true;
    await fetchArchivedMessages();
  };

  useLayoutEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    if (isArchivedFetch.current) {
      // Restore scroll position after loading older messages
      scrollContainer.scrollTop =
        scrollContainer.scrollHeight - prevScrollHeight.current;
      isArchivedFetch.current = false; // Reset the flag
    } else {
      // Scroll to bottom for new messages or on initial load
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [allMessages]);

  return (
    <div
      className="chat-pattern 2xl:w-[350px] xl:w-[330px] w-full flex flex-col border"
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
        {hasMore && (
          <div className="text-center">
            <button
              onClick={handleLoadMore}
              className="my-2 py-1 px-4 bg-white border border-gray-300 text-gray-600 text-sm rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
            >
              Load more messages
            </button>
          </div>
        )}
        <ul>
          {allMessages.map((msg, index) => {
            const showTimestamp =
              index === 0 ||
              new Date(msg.timestamp) -
                new Date(allMessages[index - 1].timestamp) >
                3 * 60 * 1000;
            const isSender = msg.email === email;
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
                    {isSender && (
                      <div
                        className="absolute left-0 top-[-15px] flex items-center z-20"
                        onClick={() => toggleOptionsMenu(msg.id)}
                      >
                        <button className="p-1 hover:bg-gray-200 rounded-full">
                          <BsThreeDots className="text-gray-500" />
                        </button>
                      </div>
                    )}

                    <div
                      className={`p-2 rounded-xl ${
                        isSender
                          ? "bg-[#273296] text-white text-left rounded-l-lg rounded-tr-lg rounded-br-none"
                          : "bg-[#E8EBEE] text-blue-950 text-left rounded-r-lg rounded-bl-lg rounded-tl-none"
                      }`}
                      style={{
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                      }}
                    >
                      <span>
                        {isFileMessage ? (
                          renderFileMessage(msg.message, isSender)
                        ) : (
                          <>{formatMessageWithLinks(msg.message, isSender)}</>
                        )}
                      </span>
                    </div>

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
            rows={1}
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
          onClick={() => sendMessage(message, setMessage, resetTextarea)}
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
