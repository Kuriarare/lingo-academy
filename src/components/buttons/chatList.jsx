import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import avatar from "../../assets/logos/avatar.jpg";
import ChatWindow from "../chatWindow";
import back from "../../assets/logos/back.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessagesForTeacher } from "../../redux/chatSlice";

const ChatList = ({ chats, onChatSelect }) => {
  const lastMessagesByRoom = useSelector((state) => state.chat.lastMessagesByRoom);
  const unreadCountsByRoom = useSelector((state) => state.chat.unreadCountsByRoom);

  // Helper function to format the timestamp
  const getDisplayDate = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1); 

    if (messageDate >= today) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (messageDate >= yesterday) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-[630px] flex flex-col bg-white shadow-sm rounded-lg overflow-hidden font-inter">
      {/* Professional Header */}
      <div className="px-5 py-3 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-gray-900 tracking-tight">
            Messages
          </h2>
          <div className="flex space-x-3">
            <button className="text-gray-600 hover:text-gray-900 p-1 rounded-md">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Items */}
      <ul className="flex-1 overflow-y-auto">
        {chats
          .slice() // Create a copy to avoid mutating original array
          .sort((a, b) => {
            const aLastMessage = lastMessagesByRoom[a.id];
            const bLastMessage = lastMessagesByRoom[b.id];
            
            // Handle cases where there are no messages
            if (!aLastMessage && !bLastMessage) return 0;
            if (!aLastMessage) return 1; // Put chats without messages at the bottom
            if (!bLastMessage) return -1; // Keep existing order if both have no messages

            // Compare timestamps in descending order
            const aTime = new Date(aLastMessage.timestamp).getTime();
            const bTime = new Date(bLastMessage.timestamp).getTime();
            return bTime - aTime;
          })
          .map((chat) => {
            const lastMessage = lastMessagesByRoom[chat.id];
            const unreadCount = unreadCountsByRoom[chat.id] || 0;
            const displayDate = lastMessage?.timestamp 
              ? getDisplayDate(lastMessage.timestamp)
              : null;

            return (
              <li
                key={chat.id}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 group"
                onClick={() => onChatSelect(chat)}
              >
                <div className="flex items-center">
                  <div className="relative flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 shadow-sm overflow-hidden border-2 border-white">
                      <img
                        src={chat.avatarUrl || avatar}
                        alt={chat.studentName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {chat.online === "online" && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm transform -translate-x-1 -translate-y-1"></div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-gray-900 tracking-tight">
                        {chat.name} {chat.lastName}
                      </h3>
                      {displayDate && (
                        <span className="text-xs text-gray-500 font-medium">
                          {displayDate}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1 font-normal flex items-center justify-between">
                      <span className="truncate">
                        {lastMessage ? (
                          lastMessage.type === 'file' ? (
                            <span className="text-blue-600">📎 File Attachment</span>
                          ) : (
                            lastMessage.content
                          )
                        ) : (
                          <span className="text-gray-400 italic">No messages yet</span>
                        )}
                      </span>
                      {unreadCount > 0 && (
                        <span className="bg-[#9E2FD0] text-white rounded-full px-2 py-1 text-xs ml-2 flex-shrink-0">
                          {unreadCount}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

ChatList.propTypes = {
  chats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string,
      name: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      online: PropTypes.string.isRequired,
    })
  ).isRequired,
  onChatSelect: PropTypes.func.isRequired,
};

const MainChat = ({ username, teacherChat, email }) => {
  const dispatch = useDispatch();

  const [selectedChat, setSelectedChat] = useState(null);
  dispatch(fetchMessagesForTeacher());
  return (
    <div className="h-[630px] xl:w-[350px] lg:w-[300px] bg-white rounded-lg  overflow-hidden">
      {!selectedChat ? (
        <ChatList chats={teacherChat} onChatSelect={setSelectedChat} />
      ) : (
        <div className="relative h-full">
          <button
            onClick={() => setSelectedChat(null)}
            className="absolute top-2 left-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <img src={back} alt="Back" className="w-5 h-5" />
          </button>
          <ChatWindow
            username={username}
            email={email}
            room={selectedChat.id}
            studentName={selectedChat.name}
          />
        </div>
      )}
    </div>
  );
};

MainChat.propTypes = {
  username: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  teacherChat: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string,
      name: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      online: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default MainChat;
