import PropTypes from "prop-types";
import { FaComments, FaUsers, FaUserFriends } from "react-icons/fa";

const ChatListComponent = ({ chats, onChatSelect, newMessage }) => {

  const getIconStyle = (type) => {
    const baseStyle = "border bg-opacity-20";
    switch (type) {
      case "teacher": return `${baseStyle} border-[#9E2FD0] bg-[#9E2FD0]`;
      case "group": return `${baseStyle} border-[#B15FE3] bg-[#B15FE3]`;
      default: return "border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800";
    }
  };

  const getOnlineStatus = (chat) => {
    if (chat.type === "group") return "bg-[#9E2FD0]";
    return chat.online ? "bg-green-400" : "bg-gray-300";
  };

  const getStatusText = (chat) => {
    if (chat.type === "group") return "Active Group";
    return chat.online ? "Active now" : "Last seen recently";
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-brand-dark-secondary shadow-lg border-r border-gray-200 dark:border-purple-500/20">
      <div className="p-4 bg-gradient-to-r from-[#9E2FD0] to-[#B15FE3] text-white" style={{ paddingTop: '1.1rem', paddingBottom: '1.1rem' }}>
        <h2 className="text-xl font-bold">Conversations</h2>
        <p className="text-sm text-purple-200">{chats.length} active chats</p>
      </div>

      <ul className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="rounded-lg mb-2 hover:bg-purple-50 dark:hover:bg-white/5 transition-colors duration-200 cursor-pointer"
            onClick={() => onChatSelect(chat)}
          >
            <div className="flex items-center p-4">
              <div className="relative">
                <div className={`p-3 rounded-full ${getIconStyle(chat.type)}`}>
                  {chat.type === "teacher" ? (
                    <FaUsers className="text-[#9E2FD0] w-6 h-6" />
                  ) : chat.type === "group" ? (
                    <FaUserFriends className="text-[#9E2FD0] w-6 h-6" />
                  ) : (
                    <FaComments className="text-[#9E2FD0] dark:text-gray-400 w-6 h-6" />
                  )}
                </div>
                <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ${getOnlineStatus(chat)} border-2 border-white dark:border-brand-dark-secondary`}></span>
              </div>

              <div className="flex-1 ml-4">
                <div className="flex items-center justify-between">
                  <p className="text-md font-semibold text-gray-900 dark:text-white">{chat.name}</p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{getStatusText(chat)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

ChatListComponent.propTypes = {
  chats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      online: PropTypes.string.isRequired,
      type: PropTypes.oneOf(["general", "teacher", "group"]).isRequired,
    })
  ).isRequired,
  onChatSelect: PropTypes.func.isRequired,
};

export default ChatListComponent;
