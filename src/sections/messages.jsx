import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ChatListComponent from "../components/messages/ChatListComponent";
import ChatWindowComponent from "../components/messages/ChatWindowComponent";
import { io } from "socket.io-client";
import Dashboard from "./dashboard";
import Navbar from "../components/navbar";
import back from "../assets/logos/back.png";
import { teacherChats, generalChats } from '../data/roomData';
import useMessagesSection from "../hooks/useMessagesSection";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Messages = () => {
  const user = useSelector((state) => state.user.userInfo.user);
  const { unreadCounts } = useSelector((state) => state.messages);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatList, setShowChatList] = useState(true);
  const [newMessage, setNewMessage] = useState({});
  const [socket, setSocket] = useState(null);
  const { handleChatSelect, handleBackClick } = useMessagesSection(setNewMessage, setSelectedChat, setShowChatList);

  useEffect(() => {
    const socketInstance = io(`${BACKEND_URL}`);
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newUnreadGlobalMessage', (data) => {
        const { room } = data;
        setNewMessage((prevMessages) => ({
          ...prevMessages,
          [room]: (prevMessages[room] || 0) + 1,
        }));
      });

      return () => {
        socket.off('newUnreadGlobalMessage');
      };
    }
  }, [socket]);

  const chats = [];

  if (user.role === "admin") {
    chats.push(generalChats.english, generalChats.spanish, generalChats.polish);
    chats.push(teacherChats.english, teacherChats.spanish, teacherChats.polish);
  }

  if (user.role === "teacher") {
    const normalizedLanguage = user.language ? user.language.toLowerCase() : "english";
    
    if (generalChats[normalizedLanguage]) {
      chats.push(generalChats[normalizedLanguage]);
    }
    
    if (teacherChats[normalizedLanguage]) {
      chats.push(teacherChats[normalizedLanguage]);
    }
    
    if (user.students && user.students.length > 0) {
      chats.push({
        id: user.id,
        name: `Group Chat - ${user.name}`,
        online: "online",
        type: "group",
      });
    }
  }

  if (user.role === "user") {
    if (user.teacher) {
      chats.push({
        id: user.teacher.id,
        name: `Group Chat - ${user.teacher.name}`,
        online: "online",
        type: "group",
      });
    }

    const normalizedLanguage = user.language ? user.language.toLowerCase() : "english";
    if (generalChats[normalizedLanguage]) {
      chats.push(generalChats[normalizedLanguage]);
    }
  }

  const userLanguage = user.role === 'admin' ? '' : (user.language ? user.language.charAt(0).toUpperCase() + user.language.slice(1) : ''); 
  const isAdmin = user.role === 'admin';

  const updatedChats = chats.map((chat) => {
    let roomKey = "";
    const chatLanguage = chat.name.split(" - ")[1];

    if (chat.type === "general" && (isAdmin || chatLanguage === userLanguage)) {
      roomKey = `general${chatLanguage}Room`; 
    } else if (chat.type === "teacher" && (isAdmin || chatLanguage === userLanguage)) {
      roomKey = `teachers${chatLanguage}Room`; 
    } else if (chat.type === "group") {
      roomKey = `randomRoom`; 
    }

    return {
      ...chat,
      unreadCount: unreadCounts[roomKey] || 0,
    };
  });

  return (
    <div className="flex w-full relative h-screen">
      <Dashboard />
      <div className="w-full flex flex-col">
        <section className="w-full bg-brand-navbar-light dark:bg-brand-dark-secondary shadow-md border-b border-transparent dark:border-purple-500/20">
          <div className="container">
            <Navbar header="MESSAGES PAGE" />
          </div>
        </section>

        <section className="flex-grow min-h-0">
          <div className={`w-full h-full ${showChatList ? 'hidden lg:flex' : 'flex'}`}>
            <section className="w-[300px] bg-gray-100 dark:bg-brand-dark-secondary hidden lg:block">
              <ChatListComponent
                chats={updatedChats}
                onChatSelect={handleChatSelect}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                socket={socket}
              />
            </section>

            <section className="flex-1">
              {selectedChat ? (
                <>
                  <ChatWindowComponent
                    username={user.name}
                    email={user.email}
                    userUrl={user.avatarUrl}
                    room={selectedChat.id}
                    studentName={selectedChat.name}
                    newMessage={newMessage}
                    userId={user.id}
                    setNewMessage={setNewMessage}
                    socket={socket}
                    onBackClick={handleBackClick}
                  />
                </>
              ) : (
                <div className="lg:flex items-center justify-center h-full hidden bg-gray-50 dark:bg-brand-dark">
                  <p className="text-gray-500 dark:text-gray-400">Select a chat to start chatting</p>
                </div>
              )}
            </section>
          </div>

          {showChatList && (
            <section className="lg:hidden h-full">
              <ChatListComponent
                chats={updatedChats}
                onChatSelect={handleChatSelect}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                socket={socket}
              />
            </section>
          )}
        </section>
      </div>
    </div>
  );
};

export default Messages;
