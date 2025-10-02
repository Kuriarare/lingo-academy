import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import avatar from "../../assets/logos/avatar.jpg";
import ChatWindow from "../chatWindow";
import back from "../../assets/logos/back.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessagesForTeacher } from "../../redux/chatSlice";
import { FiSearch } from "react-icons/fi";

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

  const getInitials = (name, lastName) => {
    const firstInitial = name ? name.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  const generateColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 75%, 60%)`;
    return color;
  };

  return (
    <div className="h-[630px] flex flex-col bg-slate-50 rounded-lg overflow-hidden font-inter">
      {/* Professional Header */}
      <div className="px-5 py-4 custom-bg text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Messages</h2>
          <button className="hover:text-gray-200 p-1 rounded-md">
            <FiSearch size={20} />
          </button>
        </div>
      </div>

      {/* Chat Items */}
      <ul className="flex-1 overflow-y-auto p-0">
        {chats
          .slice() // Create a copy to avoid mutating original array
          .sort((a, b) => {
            const aLastMessage = lastMessagesByRoom[a.id];
            const bLastMessage = lastMessagesByRoom[b.id];

            if (!aLastMessage && !bLastMessage) return 0;
            if (!aLastMessage) return 1;
            if (!bLastMessage) return -1;

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
            const initials = getInitials(chat.name, chat.lastName);
            const avatarColor = generateColor(chat.name);

            return (
              <li
                key={chat.id}
                className="bg-white my-1 ml-3 p-3 rounded-lg shadow-sm hover:shadow-md hover:border-purple-300 border border-transparent transition-all cursor-pointer"
                onClick={() => onChatSelect(chat)}
              >
                <div className="flex items-center">
                  <div className="relative flex-shrink-0 mr-4">
                    {chat.avatarUrl ? (
                      <img
                        src={chat.avatarUrl}
                        alt={chat.studentName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: avatarColor }}
                      >
                        {initials}
                      </div>
                    )}
                    {chat.online === "online" && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-slate-800 truncate">
                        {chat.name} {chat.lastName}
                      </h3>
                      {displayDate && (
                        <span className="text-xs text-gray-500 font-medium">
                          {displayDate}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 truncate">
                        {lastMessage ? (
                          lastMessage.type === "file" ? (
                            <span className="text-blue-600">
                              📎 File Attachment
                            </span>
                          ) : (
                            lastMessage.content
                          )
                        ) : (
                          <span className="text-gray-400 italic">
                            No messages yet
                          </span>
                        )}
                      </p>
                      {unreadCount > 0 && (
                        <span className="bg-purple-600 text-white rounded-full px-2.5 py-1 text-xs font-bold ml-2 flex-shrink-0">
                          {unreadCount}
                        </span>
                      )}
                    </div>
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
