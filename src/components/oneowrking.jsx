// import { useParams, useNavigate } from "react-router-dom";
// import { useRef, useEffect, useState } from "react";
// import socketio from "socket.io-client";
// import microOn from "../assets/logos/micro-on.png";
// import microOff from "../assets/logos/micro-off.png";
// import videoOn from "../assets/logos/video-on.png";
// import videoOff from "../assets/logos/video-off.png";
// import hang from "../assets/logos/hang.png";
// import screenShare from "../assets/logos/share.png";
// import screenStop from "../assets/logos/stop-screen.png";
// import chat from "../assets/logos/chat.png";
// import ChatWindow from "./chatWindow";
// import { useSelector } from "react-redux";
// import MainChat from "./buttons/chatList";

// function CallScreen() {
//   const user = useSelector((state) => state.user.userInfo.user);

//   const [room, setRoom] = useState("");
//   const [username, setUsername] = useState("");
//   const [teacherChat, setTeacherChat] = useState([]);
//   const [chatIsOpen, setChatIsOpen] = useState(false);

//   useEffect(() => {
//     if (user.role === "teacher") {
//       setUsername(user.name);
//       setRoom(user._id);
//       setTeacherChat(user.students);
//     } else {
//       setUsername(user.name);
//       setRoom(user._id);
//     }
//   }, [user]);

//   const params = useParams();
//   const navigate = useNavigate();
//   const localUsername = params.username;
//   const roomName = params.room;
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);

//   const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
//   const [cameraEnabled, setCameraEnabled] = useState(true);
//   const [screenSharing, setScreenSharing] = useState(false);
//   const localStreamRef = useRef(null);
//   const screenStreamRef = useRef(null);

//   // http://localhost:8000
//   // https://srv570363.hstgr.cloud:8000
//   const socket = socketio("http://localhost:8000/", {
//     autoConnect: false,
//   });

//   let pc = null;

//   const sendData = (data) => {
//     socket.emit("data", {
//       username: localUsername,
//       room: roomName,
//       ...data,
//     });
//   };

//   const startConnection = () => {
//     navigator.mediaDevices
//       .getUserMedia({
//         audio: true,
//         video: true,
//       })
//       .then((stream) => {
//         console.log("Local Stream found");
//         localVideoRef.current.srcObject = stream;
//         localStreamRef.current = stream;

//         // Log tracks in the local stream
//         stream.getTracks().forEach((track) => {
//           console.log("Local track:", track.kind);
//         });

//         socket.connect();
//         socket.emit("join", { username: localUsername, room: roomName });
//       })
//       .catch((error) => {
//         console.error("Stream not found: ", error);
//       });
//   };

//   const onIceCandidate = (event) => {
//     if (event.candidate) {
//       console.log("Sending ICE candidate");
//       sendData({
//         type: "candidate",
//         candidate: event.candidate,
//       });
//     }
//   };

//   const onTrack = (event) => {
//     console.log("Adding remote track");
//     const remoteStream = event.streams[0];
//     remoteVideoRef.current.srcObject = remoteStream;

//     // Log tracks in the remote stream
//     remoteStream.getTracks().forEach((track) => {
//       console.log("Remote track:", track.kind);
//     });
//   };

//   const createPeerConnection = () => {
//     try {
//       pc = new RTCPeerConnection({
//         iceServers: [
//           // { urls: "stun:stun.l.google.com:19302" }
//           {
//             urls: "turn:195.110.58.68:3478",
//             username: "sincelejana",
//             credential: "asdkASDIORNVM345Fasdegf23",
//           },
//         ],
//       });

//       pc.onicecandidate = onIceCandidate;
//       pc.ontrack = onTrack;

//       const localStream = localStreamRef.current;
//       if (localStream) {
//         localStream.getTracks().forEach((track) => {
//           pc.addTrack(track, localStream);
//         });
//       } else {
//         console.error("Local stream is not available");
//       }

//       console.log("PeerConnection created");
//     } catch (error) {
//       console.error("PeerConnection failed: ", error);
//     }
//   };

//   const setAndSendLocalDescription = async (sessionDescription) => {
//     try {
//       await pc.setLocalDescription(sessionDescription);
//       console.log("Local description set");
//       sendData({
//         type: sessionDescription.type,
//         sdp: sessionDescription.sdp,
//       });
//     } catch (error) {
//       console.error("Failed to set local description: ", error);
//     }
//   };

//   const sendOffer = async () => {
//     try {
//       console.log("Sending offer");
//       const offer = await pc.createOffer();
//       await setAndSendLocalDescription(offer);
//     } catch (error) {
//       console.error("Send offer failed: ", error);
//     }
//   };

//   const sendAnswer = async () => {
//     try {
//       console.log("Sending answer");
//       const answer = await pc.createAnswer();
//       await setAndSendLocalDescription(answer);
//     } catch (error) {
//       console.error("Send answer failed: ", error);
//     }
//   };

//   const signalingDataHandler = async (data) => {
//     if (!data || !data.type) {
//       console.log("Received data without type:", data);
//       return;
//     }

//     console.log("Signaling data received:", data);

//     try {
//       if (data.type === "offer") {
//         console.log("Received offer:", data);
//         createPeerConnection();
//         await pc.setRemoteDescription(new RTCSessionDescription(data));
//         await sendAnswer();
//       } else if (data.type === "answer") {
//         console.log("Received answer:", data);
//         await pc.setRemoteDescription(new RTCSessionDescription(data));
//       } else if (data.type === "candidate") {
//         console.log("Received candidate:", data);
//         await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
//       } else {
//         console.log("Unknown Data Type:", data.type);
//       }
//     } catch (error) {
//       console.error("Error handling signaling data: ", error);
//     }
//   };

//   socket.on("ready", () => {
//     console.log("Ready to Connect!");
//     createPeerConnection();
//     sendOffer();
//   });

//   socket.on("data", (data) => {
//     console.log("Data received: ", data);
//     signalingDataHandler(data);
//   });

//   useEffect(() => {
//     startConnection();
//     return function cleanup() {
//       if (pc) {
//         pc.close();
//       }
//       socket.disconnect();
//     };
//   }, []);

//   const toggleMicrophone = () => {
//     const enabled = !microphoneEnabled;
//     const audioTrack = localStreamRef.current.getAudioTracks()[0];
//     if (audioTrack) {
//       audioTrack.enabled = enabled;
//     }
//     setMicrophoneEnabled(enabled);
//   };

//   const toggleCamera = () => {
//     const enabled = !cameraEnabled;
//     const videoTrack = localStreamRef.current.getVideoTracks()[0];
//     if (videoTrack) {
//       videoTrack.enabled = enabled;
//     }
//     setCameraEnabled(enabled);
//   };

//   const shareScreen = () => {
//     if (!pc) {
//       console.error("Peer connection is not initialized");
//       return;
//     }
//     if (!navigator.mediaDevices.getDisplayMedia) {
//       console.error("Screen sharing is not supported on this device.");
//       alert("Screen sharing is not supported on this device.");
//       return;
//     }
//     if (!screenSharing) {
//       navigator.mediaDevices
//         .getDisplayMedia({ video: true })
//         .then((screenStream) => {
//           const screenTrack = screenStream.getVideoTracks()[0];
//           if (!screenTrack) {
//             console.error("No video track found in screen stream");
//             return;
//           }

//           // Ensure pc is initialized
//           if (pc) {
//             pc.getSenders().forEach((sender) => {
//               if (sender.track.kind === "video") {
//                 sender
//                   .replaceTrack(screenTrack)
//                   .then(() => {
//                     console.log("Screen track replaced successfully");
//                   })
//                   .catch((error) => {
//                     console.error("Failed to replace track:", error);
//                   });
//               }
//             });

//             screenStreamRef.current = screenStream;
//             setScreenSharing(true);

//             // Handle stopping screen sharing
//             screenStream.getTracks().forEach((track) => {
//               track.onended = () => {
//                 console.log("Screen sharing stopped");
//                 const localVideoTrack =
//                   localStreamRef.current.getVideoTracks()[0];
//                 if (localVideoTrack && pc) {
//                   pc.getSenders().forEach((sender) => {
//                     if (sender.track.kind === "video") {
//                       sender
//                         .replaceTrack(localVideoTrack)
//                         .then(() => {
//                           console.log(
//                             "Local video track restored successfully"
//                           );
//                           setScreenSharing(false);
//                           // Renegotiate to update the remote peer
//                           sendOffer();
//                         })
//                         .catch((error) => {
//                           console.error(
//                             "Failed to restore local video track:",
//                             error
//                           );
//                         });
//                     }
//                   });
//                 } else {
//                   console.error(
//                     "No local video track found or pc is not initialized"
//                   );
//                 }
//               };
//             });
//           } else {
//             console.error("Peer connection is not initialized");
//           }
//         })
//         .catch((error) => {
//           console.error("Failed to get display media:", error);
//         });
//     } else {
//       // Stop sharing screen
//       if (screenStreamRef.current) {
//         screenStreamRef.current.getTracks().forEach((track) => track.stop());
//         setScreenSharing(false);

//         // Restore local video track
//         const localVideoTrack = localStreamRef.current.getVideoTracks()[0];
//         if (localVideoTrack && pc) {
//           pc.getSenders().forEach((sender) => {
//             if (sender.track.kind === "video") {
//               sender
//                 .replaceTrack(localVideoTrack)
//                 .then(() => {
//                   console.log("Local video track restored successfully");
//                   // Renegotiate to update the remote peer
//                   sendOffer();
//                 })
//                 .catch((error) => {
//                   console.error("Failed to restore local video track:", error);
//                 });
//             }
//           });
//         } else {
//           console.error("No local video track found or pc is not initialized");
//         }
//       }
//     }
//   };

//   const endCall = () => {
//     if (pc) {
//       pc.close();
//     }
//     socket.disconnect();
//     navigate("/schedule");
//     window.location.reload();
//   };

//   return (
//     <div className="w-full h-[100vh] relative flex flex-col justify-center bg-[#202124] px-2">
//       <div className="flex justify-center gap-2 mb-2 text-white">
//         {/* <label className="">{"Name: " + localUsername}</label>

//         <label className="hidden">{"Room: " + roomName}</label> */}
//       </div>
//       <div className="w-full rounded-lg flex flex-col lg:flex-row items-center justify-center overflow-hidden gap-2">
//         <video
//           autoPlay
//           muted
//           playsInline
//           ref={localVideoRef}
//           className="w-full lg:w-1/2 md:h-auto rounded-lg object-contain scale-x-[-1]"
//         />
//         <video
//           autoPlay
//           playsInline
//           ref={remoteVideoRef}
//           className="w-full lg:w-1/2 md:h-auto rounded-lg object-contain scale-x-[-1]"
//         />

//         <div className={`${chatIsOpen ? "" : "hidden"}`}>
//           {user.role === "teacher" ? (
//             <MainChat username={username} teacherChat={teacherChat} />
//           ) : (
//             <ChatWindow username={username} room={room} />
//           )}
//         </div>
//       </div>

//       <div className=" flex space-x-4 justify-center mt-4">
//         <button
//           onClick={toggleMicrophone}
//           className="bg-white text-black px-3 py-2 rounded flex items-center"
//         >
//           <img
//             src={microphoneEnabled ? microOn : microOff}
//             alt="Microphone"
//             className="w-6 h-6"
//           />
//         </button>

//         <button
//           onClick={() => setChatIsOpen(!chatIsOpen)}
//           className="bg-white text-black px-3 py-2 rounded flex items-center"
//         >
//           <img src={chat} alt="Screen Share" className="w-6 h-6" />
//         </button>

//         <button
//           onClick={toggleCamera}
//           className="bg-white text-black px-3 py-2 rounded flex items-center"
//         >
//           <img
//             src={cameraEnabled ? videoOn : videoOff}
//             alt="Camera"
//             className="w-6 h-6"
//           />
//         </button>
//         <button
//           onClick={shareScreen}
//           className="bg-white text-black px-3 py-2 rounded flex items-center"
//         >
//           <img
//             src={screenSharing ? screenStop : screenShare}
//             alt="Screen Share"
//             className="w-6 h-6"
//           />
//         </button>
//         <button
//           onClick={endCall}
//           className="bg-red-600 text-white px-3 py-2 rounded flex items-center"
//         >
//           <img src={hang} alt="Hang Up" className="w-6 h-6" />
//         </button>
//       </div>
//     </div>
//   );
// }

// export default CallScreen;
