import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ChatListComponent from "../components/messages/ChatListComponent";
import ChatWindowComponent from "../components/messages/ChatWindowComponent";
import Dashboard from "./dashboard";
import Navbar from "../components/navbar";
import back from '../assets/logos/back.png'; // Back arrow image

const Messages = () => {
  const user = useSelector((state) => state.user.userInfo.user); // Get the user info
  console.log('Full info:', user);  // Debugging

  const [selectedChat, setSelectedChat] = useState(null);
  const [showChatList, setShowChatList] = useState(true); // State to control chat list visibility on smaller devices

  // Define the general chat rooms (these are always available)
  const generalChats = {
    english: { id: "uuid-english", name: "General Chat - English", online: "online", type: "general" },
    spanish: { id: "uuid-spanish", name: "General Chat - Spanish", online: "online", type: "general" },
    polish: { id: "uuid-polish", name: "General Chat - Polish", online: "online", type: "general" },
  };

  // Define teacher chats (these are available for admins and teachers)
  const teacherChats = {
    english: { id: "uuid-teacher-english", name: "Teachers Chat - English", online: "offline", type: "teacher" },
    spanish: { id: "uuid-teacher-spanish", name: "Teachers Chat - Spanish", online: "offline", type: "teacher" },
    polish: { id: "uuid-teacher-polish", name: "Teachers Chat - Polish", online: "offline", type: "teacher" },
  };

  // The chat list that will be populated based on the user role and language
  const chats = [];

  // Handle case for admin
  if (user.role === "admin") {
    chats.push(generalChats.english, generalChats.spanish, generalChats.polish);
    chats.push(teacherChats.english, teacherChats.spanish, teacherChats.polish);
  }

  // If the user is a teacher
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
        type: "group"
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
    const normalizedLanguage = user.language ? user.language.toLowerCase() : "english";
    if (generalChats[normalizedLanguage]) {
      chats.push(generalChats[normalizedLanguage]);
    }
  }

  console.log("Available chats for user:", chats);  // Debugging

  const handleChatSelect = (chat) => {
    setSelectedChat(chat); // Update the selected chat when the user clicks a chat
    setShowChatList(false); // Hide the chat list when a chat is selected on smaller screens
  };

  const handleBackClick = () => {
    setSelectedChat(null); // Reset the selected chat to null (go back to the chat list)
    setShowChatList(true); // Show the chat list again on smaller screens
  };

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
              <ChatListComponent chats={chats} onChatSelect={handleChatSelect} />
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
              <ChatListComponent chats={chats} onChatSelect={handleChatSelect} />
            </section>
          )}
        </section>
      </div>
    </div>
  );
};

export default Messages;
