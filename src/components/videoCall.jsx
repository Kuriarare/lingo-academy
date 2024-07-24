import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

const VideoCall = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
//   const [user, setUser] = useState({});
//  console.log(user._id);
 

  // useEffect(() => {
  //   fetch('http://localhost:3001/userdata', {  
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
       
  //     }
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     setUser(data);
  //   })
  //   .catch((error) => {
  //     console.error('Error:', error);
  //   });
  // }, []);

  useEffect(() => {
    const startMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = stream;
        setLocalStream(stream);
      } catch (err) {
        console.error('Error accessing media devices.', err);
      }
    };

    startMedia();

    return () => {
      if (peerConnection) peerConnection.close();
    };
  }, []);

  useEffect(() => {
    if (localStream) {
      const pc = new RTCPeerConnection();
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('candidate', 'room1', event.candidate);
        }
      };

      pc.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      socket.on('offer', async (offer) => {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', 'room1', answer);
      });

      socket.on('answer', async (answer) => {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      });

      socket.on('candidate', async (candidate) => {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error('Error adding received ice candidate', error);
        }
      });

      setPeerConnection(pc);
    }
  }, [localStream]);

  const joinRoom = (roomId, userId) => {
    socket.emit('join-room', roomId, userId);
  };

  const createOffer = async () => {
    if (peerConnection) {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit('offer', 'room1', offer);
    }
  };

  const toggleCamera = () => {
    localStream.getVideoTracks()[0].enabled = !isCameraOn;
    setIsCameraOn(!isCameraOn);
  };

  const toggleMicrophone = () => {
    localStream.getAudioTracks()[0].enabled = !isMicrophoneOn;
    setIsMicrophoneOn(!isMicrophoneOn);
  };

  const startScreenShare = async () => {
    if (!isScreenSharing) {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const videoTrack = screenStream.getVideoTracks()[0];
      videoTrack.onended = () => {
        stopScreenShare();
      };
      localStream.getVideoTracks()[0].stop();
      const sender = peerConnection.getSenders().find(s => s.track.kind === videoTrack.kind);
      sender.replaceTrack(videoTrack);
      localVideoRef.current.srcObject = screenStream;
      setIsScreenSharing(true);
    }
  };

  const stopScreenShare = () => {
    const videoTrack = localStream.getVideoTracks()[0];
    const sender = peerConnection.getSenders().find(s => s.track.kind === videoTrack.kind);
    sender.replaceTrack(videoTrack);
    localVideoRef.current.srcObject = localStream;
    setIsScreenSharing(false);
  };

  const startRecording = () => {
    const recorder = new MediaRecorder(localStream);
    recorder.ondataavailable = (event) => {
      const blob = new Blob([event.data], { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'recording.webm';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    };
    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };

  const hangUp = () => {
    peerConnection.close();
    setPeerConnection(null);
    setLocalStream(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4">
        <video ref={localVideoRef} autoPlay playsInline muted className="rounded shadow-lg" style={{ transform: 'scaleX(-1)' }} />
        <video ref={remoteVideoRef} autoPlay playsInline className="rounded shadow-lg" style={{ transform: 'scaleX(-1)' }} />
      </div>
      <div className="flex gap-4 mt-4">
        <button onClick={() => joinRoom('room1', "userId")} className="px-4 py-2 bg-blue-500 text-white rounded shadow-md">Join Room</button>
        <button onClick={createOffer} className="px-4 py-2 bg-green-500 text-white rounded shadow-md">Call</button>
        <button onClick={toggleCamera} className={`px-4 py-2 rounded shadow-md ${isCameraOn ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
          {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
        </button>
        <button onClick={toggleMicrophone} className={`px-4 py-2 rounded shadow-md ${isMicrophoneOn ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
          {isMicrophoneOn ? 'Mute' : 'Unmute'}
        </button>
        <button onClick={isScreenSharing ? stopScreenShare : startScreenShare} className="px-4 py-2 bg-yellow-500 text-white rounded shadow-md">
          {isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
        </button>
        <button onClick={recording ? stopRecording : startRecording} className="px-4 py-2 bg-purple-500 text-white rounded shadow-md">
          {recording ? 'Stop Recording' : 'Record'}
        </button>
        <button onClick={hangUp} className="px-4 py-2 bg-red-700 text-white rounded shadow-md">Hang Up</button>
      </div>
    </div>
  );
};

export default VideoCall;
