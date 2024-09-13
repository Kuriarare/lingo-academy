import { useState } from 'react';
import ChatWindow from '../chatWindow';
import avatar from '../../assets/logos/avatar.jpg';

const ChatList = ({ chats, onChatSelect }) => {
  return (
    <div className="h-[600px]  flex flex-col border p-3 bg-white">
      <h2 className="text-center mb-4">All Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li
            key={chat._id}
            className="flex items-center p-2 mb-2 border-b cursor-pointer"
            onClick={() => onChatSelect(chat)}
          >
            <img
              src={chat.avatarUrl ? chat.avatarUrl : avatar}
              alt={chat.studentName}
              className="w-10 h-10 rounded-full mr-3"
            />
            <span>{chat.name} {chat.lastName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const MainChat = ({ username, teacherChat }) => {
  const [selectedChat, setSelectedChat] = useState(null);

  // Example list of chats (for the teacher view)
//   const chats = [
//     { id: '1', studentName: 'John Doe', studentImage: 'https://randomuser.me/api/portraits/men/1.jpg', studentId: 's1' },
//     { id: '2', studentName: 'Jane Smith', studentImage: 'https://randomuser.me/api/portraits/women/2.jpg', studentId: 's2' },

//   ];

  // Function to handle chat selection
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  // Function to go back to the chat list
  const handleBackToChats = () => {
    setSelectedChat(null);
  };

  return (
    <div className="h-[600px] w-[340px] border bg-gray-100">
      {!selectedChat ? (
        // Show the chat list if no chat is selected
        <ChatList chats={teacherChat} onChatSelect={handleChatSelect} />
      ) : (
        // Show the chat window if a chat is selected
        <div className="relative h-full">
          <button
            onClick={handleBackToChats}
            className="absolute top-2 left-2 p-2 bg-gray-300 rounded-full"
          >
            ← Back
          </button>
          <ChatWindow
            username={username}
            room = {selectedChat._id}
          />
        </div>
      )}
    </div>
  );
};

export default MainChat;
