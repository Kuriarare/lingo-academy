import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ChatListComponent from "../components/messages/ChatListComponent";
import ChatWindowComponent from "../components/messages/ChatWindowComponent";
import { io } from "socket.io-client";
import Dashboard from "./dashboard";
import Navbar from "../components/navbar";
import back from "../assets/logos/back.png";
import {teacherChats, generalChats} from '../data/roomData'
import useMessagesSection from "../hooks/useMessagesSection";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Messages = () => {

 
  const user = useSelector((state) => state.user.userInfo.user);
  console.log('User Id:', user.id);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatList, setShowChatList] = useState(true);
  const [newMessage, setNewMessage] = useState({})
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
  
        console.log('Mensaje no leído en la sala:', room);
  
        setNewMessage((prevMessages) => ({
          ...prevMessages,
          [room]: (prevMessages[room] || 0) + 1, // Incrementa el contador solo para esta sala
        }));
      });
  
      return () => {
        socket.off('newUnreadGlobalMessage'); // Limpieza del listener
      };
    }
  }, [socket]);


  // The chat list that will be populated based on the user role and language
  const chats = [];

  // Handle case for admin
  if (user.role === "admin") {
    chats.push(generalChats.english, generalChats.spanish, generalChats.polish);
    chats.push(teacherChats.english, teacherChats.spanish, teacherChats.polish);
  }

  // If the user is a teacher
  if (user.role === "teacher") {
    const normalizedLanguage = user.language
      ? user.language.toLowerCase()
      : "english";
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

  // If the user is a student
  if (user.role === "user") {
    if (user.teacher) {
      chats.push({
        id: user.teacher.id,
        name: `Group Chat - ${user.teacher.name}`,
        online: "online",
        type: "group",
      });
    }
    const normalizedLanguage = user.language
      ? user.language.toLowerCase()
      : "english";
    if (generalChats[normalizedLanguage]) {
      chats.push(generalChats[normalizedLanguage]);
    }
  }

 
  

  return (
    <div className="flex w-full relative h-[97vh]">
      <Dashboard />
      <div className="w-full h-[100vh]">
        <section className="w-full custom-bg">
          <div className="container">
            <Navbar header="MESSAGES PAGE" />
          </div>
        </section>

        <section>
          <div className="flex w-full">
            {/* Chat List for larger devices */}
            <section className="w-[300px] bg-gray-100 hidden lg:block">
              <ChatListComponent
                chats={chats}
                onChatSelect={handleChatSelect}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                socket={socket}
              />
            </section>

            {/* Chat window */}
            <section className="flex-1">
              {selectedChat ? (
                <>
                  {/* Back button for md and smaller screens */}
                  <div className="lg:hidden absolute top-16 left-5 z-10">
                    <button onClick={handleBackClick}>
                      <img src={back} alt="Back" className="w-8 h-8" />
                    </button>
                  </div>
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
                  />
                </>
              ) : (
                <div className="lg:flex items-center justify-center h-full hidden">
                  <p>Select a chat to start chatting</p>
                </div>
              )}
            </section>
          </div>

          {/* Chat list for medium and small devices */}
          {showChatList && (
            <section className="lg:hidden">
              <ChatListComponent
                chats={chats}
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
