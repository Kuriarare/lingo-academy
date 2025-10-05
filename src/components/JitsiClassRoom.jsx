import { useEffect, useRef, useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useLocation, useNavigate } from "react-router-dom";
import ChatWindow from "./chatWindow";
import { FiMessageSquare } from "react-icons/fi";
import CallChatWindow from "./messages/CallChatWindow";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessagesForTeacher,
  fetchUnreadCountsForStudent,
} from "../redux/chatSlice";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const JitsiClassRoom = () => {
  const location = useLocation();
  const { userName, roomId, email, fromMeeting } = location.state || {};
  const domain = "jitsi.srv570363.hstgr.cloud";
  const unreadCountsByRoom = useSelector(
    (state) => state.chat.unreadCountsByRoom
  );
  const studentUnreadCount = useSelector(
    (state) => state.chat.studentUnreadCount
  );

  const user = useSelector((state) => state.user.userInfo.user);

  const apiRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [chatMessages, setChatMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.executeCommand("displayName", userName);
    }
  }, [userName]);
  // useEffect(() => {
  //   if (user.role === "teacher") {
  //     setTeacherChats(user.students);
  //   }
  // }, [user]);


  const unreadCount = unreadCountsByRoom[roomId] || 0;

  const options = {
    configOverwrite: {
      startWithAudioMuted: false,
      disableModeratorIndicator: true,
      apiLogLevels: ["error"], // Log only errors
      logging: {
        defaultLogLevel: "error",
        loggers: {
          "modules/RTC/TraceablePeerConnection.js": "error",
          "modules/statistics/CallStats.js": "error",
        },
      },
    },
    interfaceConfigOverwrite: {
      DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
    },
    userInfo: {
      displayName: userName,
    },
  };

  const handleCallEnd = () => {
    navigate("/schedule");
    window.location.reload();
  };

  const handleIncomingMessage = (message) => {
    setChatMessages((prevMessages) => [...prevMessages, message]);
  };

  const sendMessageToJitsi = (message) => {
    if (apiRef.current) {
      apiRef.current.executeCommand("sendEndpointTextMessage", "", message);
    }
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "row",
        position: "relative",
      }}
    >
      {loading && (
        <section className="dots-container dark:bg-brand-dark">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </section>
      )}
      <div
        className="relative"
        style={{ flex: 1, display: loading ? "none" : "block" }}
      >
        <JitsiMeeting
          domain={domain}
          roomName={roomId}
          configOverwrite={options.configOverwrite}
          interfaceConfigOverwrite={options.interfaceConfigOverwrite}
          userInfo={options.userInfo}
          onApiReady={(externalApi) => {
            apiRef.current = externalApi;
            externalApi.executeCommand("displayName", userName);
            externalApi.addEventListener("videoConferenceLeft", handleCallEnd);
            externalApi.addEventListener("incomingMessage", (message) => {
              handleIncomingMessage(message);
            });
            setLoading(false);
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100%";
            iframeRef.style.width = "100%";
          }}
        />

        <button
          onClick={toggleChat}
          className="absolute lg:bottom-[23px] 2xl:bottom-[17px] bottom-[8rem] py-[17px] 2xl:right-[30%] lg:right-[20%] right-[5%] bg-[#191318] text-white rounded-lg p-2 cursor-pointer"
        >
          <FiMessageSquare size={24} />
          {(user.role === "teacher" ? unreadCount : studentUnreadCount) > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#9E2FD0] text-white text-lg font-semibold rounded-full px-2">
              {user.role === "teacher" ? unreadCount : studentUnreadCount}
            </span>
          )}
        </button>
      </div>
      {/* Chat Window */}
      <div
        className={`bg-white transition-all duration-300 ${
          showChat
            ? "lg:relative absolute top-0 right-0 z-10 2xl:w-[350px] xl:w-[330px] w-full h-full translate-x-0"
            : "translate-x-full"
        }`}
      >
        {/* Renderizar componentes SOLO cuando showChat es true */}
        {showChat && (
          <div className="w-full h-full">
            {fromMeeting ? (
              <CallChatWindow
                username={userName}
                email={email}
                room={roomId}
                height="100vh"
                externalMessages={chatMessages}
                onSendMessage={sendMessageToJitsi}
              />
            ) : (
              <ChatWindow
                username={userName}
                email={email}
                room={roomId}
                height="100vh"
                isChatOpen={isChatOpen}
                setIsChatOpen={setIsChatOpen}
                setShowChat={setShowChat}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default JitsiClassRoom;
