import { useParams, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import socketio from "socket.io-client";
import microOn from "../assets/logos/micro-on.png";
import microOff from "../assets/logos/micro-off.png";
import videoOn from "../assets/logos/video-on.png";
import videoOff from "../assets/logos/video-off.png";
import hang from "../assets/logos/hang.png";
import screenShare from "../assets/logos/share.png";
import screenStop from "../assets/logos/stop-screen.png";
import chat from "../assets/logos/chat.png";
import ChatWindow from "./chatWindow";
import { useSelector } from "react-redux";
const LOCAL_HOST = "https://lingo.srv570363.hstgr.cloud";

function CallScreen() {
  const user = useSelector((state) => state.user.userInfo.user);

  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  // const [teacherChat, setTeacherChat] = useState([]);
  const [chatIsOpen, setChatIsOpen] = useState(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [isRemoteSharing, setIsRemoteSharing] = useState(false);
  const [roomShareScreen, setRoomShareScreen] = useState("");
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const pc = useRef(null); 

  useEffect(() => {
    if (user.role === "teacher") {
      setUsername(user.name);
      // setRoom(user._id);

      setRoomShareScreen(user.id);
    } else {
      setUsername(user.name);
      // setRoom(user.id);

      setRoomShareScreen(user.id);
    }
  }, [user]);

  const params = useParams();
  const navigate = useNavigate();
  const localUsername = params.username;
  const roomName = params.room;

  const socket = socketio(`${LOCAL_HOST}`, {
    autoConnect: false,
  });

  const sendData = (data) => {
    socket.emit("data", {
      username: localUsername,
      room: roomName,
      ...data,
    });
  };

  const startConnection = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        console.log("Local Stream found");
        localVideoRef.current.srcObject = stream;
        localStreamRef.current = stream;
        socket.connect();
        socket.emit("join", { username: localUsername, room: roomName });
      })
      .catch((error) => {
        console.error("Stream not found: ", error);
      });
  };

  const onIceCandidate = (event) => {
    if (event.candidate) {
      console.log("Sending ICE candidate");
      sendData({
        type: "candidate",
        candidate: event.candidate,
      });
    }
  };

  const onTrack = (event) => {
    console.log("Adding remote track");
    const remoteStream = event.streams[0];
    remoteVideoRef.current.srcObject = remoteStream;
  };

  const createPeerConnection = () => {
    if (pc.current) {
      console.log("PeerConnection already exists");
      return;
    }

    try {
      pc.current = new RTCPeerConnection({
        iceServers: [
          {
            urls: "turn:195.110.58.68:3478",
            username: "sincelejana",
            credential: "asdkASDIORNVM345Fasdegf23",
          },
        ],
      });

      pc.current.onicecandidate = onIceCandidate;
      pc.current.ontrack = onTrack;

      const localStream = localStreamRef.current;
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          pc.current.addTrack(track, localStream);
        });
      } else {
        console.error("Local stream is not available");
      }

      console.log("PeerConnection created");
    } catch (error) {
      console.error("PeerConnection failed: ", error);
    }
  };

  const setAndSendLocalDescription = async (sessionDescription) => {
    try {
      await pc.current.setLocalDescription(sessionDescription);
      console.log("Local description set");
      sendData({
        type: sessionDescription.type,
        sdp: sessionDescription.sdp,
      });
    } catch (error) {
      console.error("Failed to set local description: ", error);
    }
  };

  const sendOffer = async () => {
    try {
      console.log("Sending offer");
      const offer = await pc.current.createOffer();
      await setAndSendLocalDescription(offer);
    } catch (error) {
      console.error("Send offer failed: ", error);
    }
  };

  const sendAnswer = async () => {
    try {
      console.log("Sending answer");
      const answer = await pc.current.createAnswer();
      await setAndSendLocalDescription(answer);
    } catch (error) {
      console.error("Send answer failed: ", error);
    }
  };

  const signalingDataHandler = async (data) => {
    if (!data || !data.type) {
      console.log("Received data without type:", data);
      return;
    }

    console.log("Signaling data received:", data);

    try {
      if (data.type === "offer") {
        console.log("Received offer:", data);
        createPeerConnection();
        await pc.current.setRemoteDescription(new RTCSessionDescription(data));
        await sendAnswer();
      } else if (data.type === "answer") {
        console.log("Received answer:", data);
        await pc.current.setRemoteDescription(new RTCSessionDescription(data));
      } else if (data.type === "candidate") {
        console.log("Received candidate:", data);
        await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
      } else {
        console.log("Unknown Data Type:", data.type);
      }
    } catch (error) {
      console.error("Error handling signaling data: ", error);
    }
  };

  socket.on("ready", () => {
    console.log("Ready to Connect!");
    createPeerConnection();
    sendOffer();
  });

  socket.on("data", (data) => {
    console.log("Data received: ", data);
    signalingDataHandler(data);
  });

  // Assuming you receive `isScreenSharing` and `senderId` from the server
  socket.on("screenSharing", (data) => {
    const { isScreenSharing, senderId } = data;
    console.log("Screen sharing state changed:", isScreenSharing);
    console.log("Sender ID:", senderId);

    // Check if the current peer is not the sender
    if (senderId !== user.id) {
      setIsRemoteSharing(isScreenSharing); // Update the remote peer's screen sharing state
    }
  });

  useEffect(() => {
    startConnection();
    return () => {
      if (pc.current) {
        pc.current.close();
      }
      socket.disconnect();
    };
  }, []);

  const toggleMicrophone = () => {
    const enabled = !microphoneEnabled;
    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = enabled;
    }
    setMicrophoneEnabled(enabled);
  };

  const toggleCamera = () => {
    const enabled = !cameraEnabled;
    const videoTrack = localStreamRef.current.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = enabled;
    }
    setCameraEnabled(enabled);
  };

  const shareScreen = async () => {
    if (!pc.current) {
      console.error("PeerConnection is not initialized");
      return;
    }
  
    if (!navigator.mediaDevices.getDisplayMedia) {
      console.error("Screen sharing is not supported on this device.");
      alert("Screen sharing is not supported on this device.");
      return;
    }
  
    try {
      if (!screenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = screenStream.getVideoTracks()[0];
  
        if (screenTrack) {
          replaceVideoTrack(screenTrack);
          screenStreamRef.current = screenStream;
          setScreenSharing(true);
          emitScreenSharing(true);
          screenStream.getTracks().forEach((track) => {
            track.onended = stopScreenSharing;
          });
        } else {
          console.error("No screen track found.");
        }
      } else {
        stopScreenSharing();
      }
    } catch (error) {
      console.error("Screen sharing failed:", error);
    }
  };
  
  const replaceVideoTrack = (newTrack) => {
    pc.current.getSenders().forEach((sender) => {
      if (sender.track.kind === "video") {
        sender.replaceTrack(newTrack).then(() => {
          console.log("Track replaced successfully");
        }).catch((error) => {
          console.error("Failed to replace track:", error);
        });
      }
    });
  };
  
  const emitScreenSharing = (isScreenSharing) => {
    const data = {
      isScreenSharing,
      room: roomName,
      senderId: user.id,
    };
  
    if (!socket.connected) {
      socket.connect();
      socket.on("connect", () => {
        socket.emit("screenSharing", data);
      });
    } else {
      socket.emit("screenSharing", data);
    }
  };
  
  const stopScreenSharing = () => {

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    const localVideoTrack = localStreamRef.current.getVideoTracks()[0];
    if (localVideoTrack) {
      replaceVideoTrack(localVideoTrack);
      emitScreenSharing(false);
    }
  
    setScreenSharing(false);
    setIsRemoteSharing(false);
  };
  
  const hangUp = () => {
    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    socket.disconnect();
    navigate("/schedule");
    window.location.reload();
  };

  const toggleChat = () => {
    setChatIsOpen(!chatIsOpen);
  };

  return (
    <div className="w-full h-[100vh] relative flex flex-col justify-center bg-[#282A2F] px-2">
      <div className="flex justify-center gap-2 mb-2 text-white">
        {/* <label className="">{"Name: " + localUsername}</label>

        <label className="hidden">{"Room: " + roomName}</label> */}
      </div>
      <div className="flex justify-center relative">
        <video
          autoPlay
          muted
          playsInline
          ref={localVideoRef}
          className="w-[200px] absolute top-2 left-2 rounded-lg object-contain scale-x-[-1]"
        />

        <video
          autoPlay
          playsInline
          ref={remoteVideoRef}
          className={`w-[1000px] rounded-lg object-fill scale-x-${
            isRemoteSharing ? "[1]" : "[-1]"
          }`}
        />

        <div className={`${chatIsOpen ? "" : "hidden"}`}>
          
            <ChatWindow username={username} room={roomName} />
         
        </div>
      </div>

      {/* <div
        className={`w-full rounded-lg ${
          isRemoteSharing ? "flex-col" : "lg:flex-row"
        } flex items-center justify-center overflow-hidden gap-2`}
      >
        <video
          autoPlay
          muted
          playsInline
          ref={localVideoRef}
          className={`${
            isRemoteSharing
              ? "w-[50px] h-[50px] rounded-lg object-contain scale-x-[-1]" // Small local video when sharing
              : screenSharing
              ? "absolute top-2 left-2 w-[50px] h-[50px] rounded-lg object-contain scale-x-[-1]"
              : "w-full lg:w-1/2 md:h-auto rounded-lg object-contain scale-x-[-1]" // Normal size otherwise
          }`}
        />

        <video
          autoPlay
          playsInline
          ref={remoteVideoRef}
          className={`${
            isRemoteSharing
              ? "w-full h-full rounded-lg object-fill scale-x-[1]" // Full screen for remote video when sharing
              : "w-full lg:w-1/2 md:h-auto rounded-lg object-contain scale-x-[-1]" // Normal size otherwise
          }`}
        />

        <div className={`${chatIsOpen ? "" : "hidden"}`}>
          {user.role === "teacher" ? (
            <ChatWindow username={username} room={roomName} />
          ) : (
            <ChatWindow username={username} room={room} />
          )}
        </div>
      </div> */}

      <div className=" flex space-x-3 justify-center mt-4">
        <button
          onClick={toggleMicrophone}
          className="bg-[#1C1E22] text-black px-3 py-2 rounded-lg flex items-center"
        >
          <img
            src={microphoneEnabled ? microOn : microOff}
            alt="Microphone"
            className="w-6 h-6"
          />
        </button>

        <button
          onClick={toggleChat}
          className="bg-[#1C1E22] text-black px-3 py-2 rounded-lg flex items-center"
        >
          <img src={chat} alt="Screen Share" className="w-6 h-6" />
        </button>

        <button
          onClick={toggleCamera}
          className="bg-[#1C1E22] text-black px-3 py-2 rounded-lg flex items-center"
        >
          <img
            src={cameraEnabled ? videoOn : videoOff}
            alt="Camera"
            className="w-6 h-6"
          />
        </button>
        <button
          onClick={shareScreen}
          className="bg-[#1C1E22] text-black px-3 py-2 rounded-lg flex items-center"
        >
          <img
            src={screenSharing ? screenStop : screenShare}
            alt="Screen Share"
            className="w-6 h-6"
          />
        </button>
        <button
          onClick={hangUp}
          className="bg-red-600 text-white px-3 py-2 rounded-lg flex items-center"
        >
          <img src={hang} alt="Hang Up" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default CallScreen;
