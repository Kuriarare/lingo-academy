import { useState } from 'react';
import avatar from '../../assets/logos/avatar.jpg';
import ChatWindow from '../chatWindow';
import back from '../../assets/logos/back.png';


const ChatList = ({ chats, onChatSelect }) => {

  return (
    <div className="h-[600px]  flex flex-col border p-3 bg-white">
      <h2 className="text-center mb-4">Messages</h2>
      <ul>
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

            {chat.online === 'online' && ( // Check if this user is online
              <span className="absolute right-2 w-[0.62rem] h-[0.62rem] bg-green-500 rounded-full"></span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const MainChat = ({ username, teacherChat }) => {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleBackToChats = () => {
    setSelectedChat(null);
  };

  return (
    <div className="h-[600px] xl:w-[340px] md:w-[300px] bg-gray-100">
      {!selectedChat ? (
        <ChatList chats={teacherChat} onChatSelect={handleChatSelect} />
      ) : (
        <div className="relative h-full">
          <button
            onClick={handleBackToChats}
            className="absolute top-[4.7px] left-2 p-2  rounded-full"
          >
            <img src={back} alt="" className="w-6 h-6" />
          </button>
          <ChatWindow
            username={username}
            room={selectedChat.id}
            studentName={selectedChat.name}
          />
        </div>
      )}
    </div>
  );
};

export default MainChat;
