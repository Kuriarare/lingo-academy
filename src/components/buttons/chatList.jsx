import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import avatar from "../../assets/logos/avatar.jpg";
import ChatWindow from "../chatWindow";
import back from "../../assets/logos/back.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessagesForTeacher } from "../../redux/chatSlice";
import { FiSearch, FiEdit, FiUsers, FiVideo, FiXCircle } from "react-icons/fi";
import Dropdown from "../schedule/Dropdown";
import { meetingRooms } from "../../constants";

const ChatList = ({
  chats,
  onChatSelect,
  user,
  handleJoinMeeting,
  setEditingEvent,
  editingEvent,
  loading,
}) => {
  const lastMessagesByRoom = useSelector((state) => state.chat.lastMessagesByRoom);
  const unreadCountsByRoom = useSelector((state) => state.chat.unreadCountsByRoom);

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
    <div className="h-[630px] flex flex-col bg-slate-50 dark:bg-brand-dark-secondary rounded-lg overflow-hidden font-inter">
      <div className="px-5 py-4 bg-gradient-to-r from-[#A567C2] to-[#9E2FD0] dark:bg-gradient-to-r dark:from-brand-dark dark:to-brand-dark-secondary text-white rounded-t-lg border dark:border-purple-500/20">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Messages</h2>
          <Dropdown>
            {(user.role === "teacher" || user.role === "admin") && (
              <button
                onClick={() => {
                  setEditingEvent((prev) => !prev);
                  if (!editingEvent) {
                    Swal.fire({
                      title: "Edit Mode Enabled",
                      text: "Select a calendar event to modify, then click a new time slot to move it.",
                      icon: "info",
                      confirmButtonText: "Got it!",
                    });
                  }
                }}
                className="block w-full text-left px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-brand-purple hover:bg-gray-100 dark:hover:bg-white/5 flex items-center"
                role="menuitem"
              >
                {editingEvent ? (
                  <>
                    <FiXCircle className="mr-2" /> Cancel Edit Mode
                  </>
                ) : (
                  <>
                    <FiEdit className="mr-2" /> Edit Calendar
                  </>
                )}
              </button>
            )}
            {(user.role === "teacher" || user.role === "user") && (
              <button
                onClick={() => handleJoinMeeting()}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center"
                role="menuitem"
              >
                <FiUsers className="mr-2" /> Group Class
              </button>
            )}
            {!loading &&
              (user.role === "teacher" || user.role === "admin") &&
              Object.entries(meetingRooms).map(([lang, roomName]) => {
                const shouldRender =
                  user.role === "admin" ||
                  (user.role === "teacher" && user.language.includes(lang));
                if (!shouldRender) return null;

                return (
                  <button
                    key={lang}
                    onClick={() => handleJoinMeeting(roomName)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center"
                    role="menuitem"
                  >
                    <FiVideo className="mr-2" /> {roomName}
                  </button>
                );
              })}
          </Dropdown>
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto p-0">
        {chats
          .slice()
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
                className="bg-white dark:bg-brand-dark my-1 ml-3 p-3 rounded-lg shadow-sm hover:shadow-md hover:border-purple-300 border border-transparent transition-all cursor-pointer"
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
                      <h3 className="text-base font-semibold text-slate-800 dark:text-white truncate">
                        {chat.name} {chat.lastName}
                      </h3>
                      {displayDate && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {displayDate}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
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

const MainChat = ({
  user,
  username,
  teacherChat,
  email,
  handleJoinMeeting,
  setEditingEvent,
  editingEvent,
  loading,
}) => {
  const dispatch = useDispatch();

  const [selectedChat, setSelectedChat] = useState(null);
  useEffect(() => {
    dispatch(fetchMessagesForTeacher());
  }, [dispatch]);
  return (
    <div className="h-[630px] bg-white dark:bg-brand-dark-secondary rounded-lg overflow-hidden shadow-lg">
      {!selectedChat ? (
        <ChatList
          chats={teacherChat}
          onChatSelect={setSelectedChat}
          user={user}
          handleJoinMeeting={handleJoinMeeting}
          setEditingEvent={setEditingEvent}
          editingEvent={editingEvent}
          loading={loading}
        />
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
