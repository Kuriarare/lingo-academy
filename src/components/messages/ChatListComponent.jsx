import PropTypes from "prop-types";
import { FaComments, FaUsers, FaUserFriends } from "react-icons/fa"; // Added FaUserFriends for Group Chat

const ChatListComponent = ({ chats, onChatSelect, newMessage }) => {
  return (
    <div className="h-[92vh] flex flex-col border p-3 bg-white">
      <h2 className="text-center mb-4 text-lg font-semibold text-gray-600">
        Chats
      </h2>
      <ul className="overflow-y-auto">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="flex items-center p-3 mb-2 border-b cursor-pointer hover:bg-gray-50 transition duration-200"
            onClick={() => onChatSelect(chat)}
          >
            {/* Conditional rendering for chat icon */}
            {chat.type === "teacher" ? (
              <FaUsers className="text-gray-600 w-6 h-6 mr-3" /> // Community icon for teacher chat
            ) : chat.type === "group" ? (
              <FaUserFriends className="text-gray-600 w-6 h-6 mr-3" /> // Group chat icon
            ) : (
              <FaComments className="text-gray-600 w-6 h-6 mr-3" /> // Regular chat icon
            )}
            <div>
              <span className="text-sm text-gray-700">{chat.name}</span>
              {newMessage[chat.id] > 0 && (
                <span className="text-xs text-red-500 ml-2">
                  {newMessage[chat.id]} new
                </span>
              )}
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
