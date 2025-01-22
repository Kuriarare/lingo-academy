import PropTypes from "prop-types";
import { FaComments, FaUsers, FaUserFriends } from "react-icons/fa"; // Added FaUserFriends for Group Chat

const ChatListComponent = ({ chats, onChatSelect, newMessage }) => {
  console.log(chats); // Debugging chats prop
  return (
    <div className="h-[92vh] flex flex-col border p-3 bg-white">
      <h2 className="text-center mb-4 text-lg font-semibold text-gray-600">
        Chats
      </h2>
      <ul className="overflow-y-auto">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="flex items-center justify-between p-3 mb-2 border-b cursor-pointer hover:bg-gray-50 transition duration-200"
            onClick={() => onChatSelect(chat)}
          >
            {/* Left section: Icon and Name */}
            <div className="flex items-center">
              {chat.type === "teacher" ? (
                <FaUsers className="text-gray-600 w-6 h-6 mr-3" />
              ) : chat.type === "group" ? (
                <FaUserFriends className="text-gray-600 w-6 h-6 mr-3" />
              ) : (
                <FaComments className="text-gray-600 w-6 h-6 mr-3" />
              )}
              <span className="text-sm text-gray-700">{chat.name}</span>
            </div>
            {/* Right section: Unread count bubble */}
            {chat.unreadCount > 0 && (
               <span className="bg-red-500 text-white text-[11px] flex justify-center items-center rounded-full w-6 h-6 ml-auto">
                {chat.unreadCount}
              </span>
            )}
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
