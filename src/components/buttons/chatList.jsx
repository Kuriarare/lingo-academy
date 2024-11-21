import { useState } from 'react';
import PropTypes from 'prop-types';
import avatar from '../../assets/logos/avatar.jpg';
import ChatWindow from '../chatWindow';
import back from '../../assets/logos/back.png';
import 'react-perfect-scrollbar/dist/css/styles.css';


const ChatList = ({ chats, onChatSelect }) => {
  return (
    <div className="h-[600px] flex flex-col border p-3 bg-white overflow-hidden">
      <h2 className="text-center mb-4">Messages</h2>
      <ul className="max-h-[540px] overflow-y-auto">
        {chats.map((chat) => (
          <li
            key={chat.id}
            className="flex items-center p-2 mb-2 border-b cursor-pointer relative"
            onClick={() => onChatSelect(chat)}
          >
            <img
              src={chat.avatarUrl ? chat.avatarUrl : avatar}
              alt={chat.studentName}
              className="w-10 h-10 rounded-full mr-3"
            />
            <span>{chat.name} {chat.lastName}</span>
            {chat.online === 'online' && (
              <span className="absolute right-2 w-[0.62rem] h-[0.62rem] bg-green-500 rounded-full"></span>
            )}
          </li>
        ))}
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
  const [selectedChat, setSelectedChat] = useState(null);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleBackToChats = () => {
    setSelectedChat(null);
  };

  return (
    <div className="h-[600px] xl:w-[340px] lg:w-[300px] bg-gray-100">
      {!selectedChat ? (
        <ChatList chats={teacherChat} onChatSelect={handleChatSelect} />
      ) : (
        <div className="relative h-full">
          <button
            onClick={handleBackToChats}
            className="absolute top-[4.7px] left-2 p-2 rounded-full"
          >
            <img src={back} alt="" className="w-6 h-6" />
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
