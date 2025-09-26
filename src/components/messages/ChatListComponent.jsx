import PropTypes from "prop-types";
import { FaComments, FaUsers, FaUserFriends } from "react-icons/fa"; // Added FaUserFriends for Group Chat

const ChatListComponent = ({ chats, onChatSelect, newMessage }) => {

// Helper functions
const getIconStyle = (type) => {
  const baseStyle = "border bg-opacity-20";
  switch (type) {
    case "teacher": return `${baseStyle} border-[#9E2FD0] bg-[#9E2FD0]`;
    case "group": return `${baseStyle} border-[#B15FE3] bg-[#B15FE3]`;
    default: return "border-gray-200 bg-gray-100";
  }
};

const getOnlineStatus = (chat) => {
  if (chat.type === "group") return "bg-[#9E2FD0]"; // Purple for groups
  return chat.online ? "bg-green-400" : "bg-gray-300";
};

const getStatusText = (chat) => {
  if (chat.type === "group") return "Active Group"; // Hardcoded group status
  return chat.online ? "Active now" : "Last seen recently";
};

  
return (
  <div className="h-[92vh] flex flex-col border-gray-100 bg-white">
    {/* Header with brand color gradient */}
    <div className="p-5 bg-gradient-to-r from-[#9E2FD0] to-[#B15FE3]">
      <h2 className="text-[17px] font-semibold text-white">
        Conversations
        <span className="text-purple-100 font-normal block text-sm mt-1">
          {chats.length} active chats
        </span>
      </h2>
    </div>

    {/* Chat List */}
    <ul className="flex-1 overflow-y-auto custom-scrollbar">
      {chats.map((chat) => (
        <li
          key={chat.id}
          className="group relative border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
          onClick={() => onChatSelect(chat)}
        >
          <div className="flex items-center p-4 space-x-3">
            <div className={`p-2 rounded-lg ${getIconStyle(chat.type)}`}>
              {chat.type === "teacher" ? (
                <FaUsers className="text-[#9E2FD0] w-5 h-5" />
              ) : chat.type === "group" ? (
                <FaUserFriends className="text-[#9E2FD0] w-5 h-5" />
              ) : (
                <FaComments className="text-[#9E2FD0] w-5 h-5" />
              )}
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-800 truncate">
                  {chat.name}
                </span>
                {chat.unreadCount > 0 && (
                  <span className="bg-[#9E2FD0] text-white text-xs font-medium px-[6px] py-[2px] rounded-full">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${getOnlineStatus(chat)}`}></span>
                <span className="text-xs text-gray-500 font-light">
                  {getStatusText(chat)}
                </span>
              </div>
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
      type: PropTypes.oneOf(["general", "teacher", "group"]).isRequired, // Added group type
    })
  ).isRequired,
  onChatSelect: PropTypes.func.isRequired,
};

export default ChatListComponent;
