import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ChatListComponent from "../components/messages/ChatListComponent";
import ChatWindowComponent from "../components/messages/ChatWindowComponent";
import Dashboard from "./dashboard";
import Navbar from "../components/navbar";

const Messages = () => {
  const user = useSelector((state) => state.user.userInfo.user); // Get the user info
  console.log('Full info:', user);  // Debugging

  const [selectedChat, setSelectedChat] = useState(null);

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
    // If user is admin, show all general chats
    chats.push(generalChats.english, generalChats.spanish, generalChats.polish);
    // Show all teacher chats for admin
    chats.push(teacherChats.english, teacherChats.spanish, teacherChats.polish);
  }

  // If the user is a teacher
  if (user.role === "teacher") {
    // Show teacher's own general chat (based on language)
    const normalizedLanguage = user.language ? user.language.toLowerCase() : "english";
    if (generalChats[normalizedLanguage]) {
      chats.push(generalChats[normalizedLanguage]);
    }

    // Add teacher's specific chat (Teacher Chat based on language)
    if (teacherChats[normalizedLanguage]) {
      chats.push(teacherChats[normalizedLanguage]); // Adding the teacher's chat
    }

    // Now, add group chats with each of their students
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
    // Show the student a group chat based on their teacher's ID
    if (user.teacher) {
      chats.push({
        id: user.teacher.id, // The teacher's ID is the chat room ID
        name: `Group Chat - ${user.teacher.name}`,
        online: "online",
        type: "group",
      });
    }

    // Optionally: Show the student a general chat based on their language
    const normalizedLanguage = user.language ? user.language.toLowerCase() : "english";
    if (generalChats[normalizedLanguage]) {
      chats.push(generalChats[normalizedLanguage]);
    }
  }

  console.log("Available chats for user:", chats);  // Debugging

  const handleChatSelect = (chat) => {
    setSelectedChat(chat); // Update the selected chat when the user clicks a chat
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
            <section className="w-[300px] bg-gray-100">
              <ChatListComponent chats={chats} onChatSelect={handleChatSelect} />
            </section>
            <section className="flex-1">
              {selectedChat ? (
                <ChatWindowComponent
                  username={user.name}
                  email={user.email}
                  userUrl={user.avatarUrl}
                  room={selectedChat.id}
                  studentName={selectedChat.name}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>Select a chat to start chatting</p>
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Messages;
