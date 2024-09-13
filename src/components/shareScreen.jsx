import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const ShareScreen = ({ username, room }) => {
  const [socket, setSocket] = useState(null);
  const [screenSharing, setScreenSharing] = useState(false);
  const screenStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (username && room) {
      console.log(`Connecting to socket.io with username: ${username}, room: ${room}`);
      const socketInstance = io('http://localhost:8000');
      setSocket(socketInstance);

      socketInstance.emit('join', { username, room });

      socketInstance.on('signal', (data) => {
        console.log('Received signaling data:', data);
        handleSignalingData(data);
      });

      return () => {
        console.log('Disconnecting from socket.io');
        socketInstance.disconnect();
      };
    }
  }, [username, room]);

  useEffect(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.ontrack = (event) => {
        console.log('Received remote stream:', event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };
    }
  }, []);

  const handleSignalingData = (data) => {
    const { type, offer, answer, candidate } = data;

    console.log(`Handling signaling data: type=${type}`);
    if (type === 'offer') {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer)).then(() => {
          peerConnectionRef.current.createAnswer().then((answer) => {
            peerConnectionRef.current.setLocalDescription(answer);
            socket.emit('signal', { room, type: 'answer', answer });
          });
        });
      }
    } else if (type === 'answer') {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    } else if (type === 'candidate') {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } else {
      console.warn('Unknown signaling type:', type);
    }
  };

  const initializePeerConnection = () => {
    if (!peerConnectionRef.current) {
      const peerConnection = new RTCPeerConnection();
      peerConnectionRef.current = peerConnection;

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate:', event.candidate);
          socket.emit('signal', {
            room,
            type: 'candidate',
            candidate: event.candidate,
          });
        }
      };
    }
  };

  const startScreenShare = () => {
    if (!navigator.mediaDevices.getDisplayMedia) {
      alert('Screen sharing is not supported on this device.');
      return;
    }

    initializePeerConnection(); // Ensure peer connection is initialized

    navigator.mediaDevices
      .getDisplayMedia({ video: true })
      .then((screenStream) => {
        console.log('Screen sharing started');
        const screenTrack = screenStream.getVideoTracks()[0];
        if (!screenTrack) {
          console.error('No video track found in screen stream');
          return;
        }

        if (peerConnectionRef.current) {
          peerConnectionRef.current.getSenders().forEach((sender) => {
            if (sender.track && sender.track.kind === 'video') {
              sender
                .replaceTrack(screenTrack)
                .then(() => {
                  console.log('Screen track replaced successfully');
                })
                .catch((error) => {
                  console.error('Failed to replace track:', error);
                });
            }
          });

          screenStreamRef.current = screenStream;
          setScreenSharing(true);

          screenStream.getTracks().forEach((track) => {
            track.onended = stopScreenShare;
          });
        } else {
          console.error('Peer connection is not initialized');
        }
      })
      .catch((error) => {
        console.error('Failed to get display media:', error);
      });
  };

  const stopScreenShare = () => {
    console.log('Stopping screen share');
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      setScreenSharing(false);

      if (peerConnectionRef.current) {
        const localVideoTrack = localStreamRef.current ? localStreamRef.current.getVideoTracks()[0] : null;
        if (localVideoTrack) {
          peerConnectionRef.current.getSenders().forEach((sender) => {
            if (sender.track && sender.track.kind === 'video') {
              sender
                .replaceTrack(localVideoTrack)
                .then(() => {
                  console.log('Local video track restored successfully');
                  sendOffer(); // Renegotiate to update the remote peer
                })
                .catch((error) => {
                  console.error('Failed to restore local video track:', error);
                });
            }
          });
        } else {
          console.error('No local video track found');
        }

        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
        socket.emit('signal', {
          room,
          type: 'screen-share-stop',
        });
      }
    }
  };

  const sendOffer = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.createOffer().then((offer) => {
        console.log('Creating offer:', offer);
        peerConnectionRef.current.setLocalDescription(offer);
        socket.emit('signal', {
          room,
          type: 'offer',
          offer,
        });
      });
    } else {
      console.error('Peer connection is not initialized');
    }
  };

  return (
    <div className="share-screen-container">
      <button onClick={screenSharing ? stopScreenShare : startScreenShare}>
        {screenSharing ? 'Stop Sharing Screen' : 'Start Sharing Screen'}
      </button>
      <video ref={remoteVideoRef} autoPlay playsInline />
    </div>
  );
};

export default ShareScreen;
