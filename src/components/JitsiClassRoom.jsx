import { useEffect, useRef, useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useLocation, useNavigate } from "react-router-dom";
import ChatWindow from "./chatWindow";
import { FiMessageSquare } from "react-icons/fi";
import CallChatWindow from "./messages/CallChatWindow";

const JitsiClassRoom = () => {
  const location = useLocation();
  const { userName, roomId, email, fromMeeting } = location.state || {};
  const domain = "jitsi.srv570363.hstgr.cloud";
  const apiRef = useRef(null);
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.executeCommand("displayName", userName);
    }
  }, [userName]);

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
        <section className="dots-container">
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
          className="absolute lg:bottom-[17px] bottom-[8rem] py-[17px] left-[5%] bg-[#191318] text-white rounded-lg p-2 cursor-pointer"
        >
          <FiMessageSquare size={24} />
        </button>
      </div>
      {/* Chat Window for small devices with transition */}
      <div
        className={`lg:block fixed top-0 right-0 w-[350px] h-full bg-white z-50 transition-transform transform ${
          showChat ? "lg:block translate-x-0" : "lg:block translate-x-full"
        }`}
        style={{
          transition: "transform 0.3s ease-in-out", // Smooth transition for sliding in and out
        }}
      >
        {/* Chat content stays static, unaffected by the translate effect */}
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
              externalMessages={chatMessages}
              onSendMessage={sendMessageToJitsi}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default JitsiClassRoom;
