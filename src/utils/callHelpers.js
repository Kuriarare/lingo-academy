// src/helpers/callHelpers.js

import socketio from "socket.io-client";

export const createPeerConnection = (localStreamRef, onIceCandidate, onTrack) => {
  let pc = new RTCPeerConnection({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" } // Using Google's public STUN server
    ],
  });

  pc.onicecandidate = onIceCandidate;
  pc.ontrack = onTrack;

  const localStream = localStreamRef.current;
  if (localStream) {
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });
  } else {
    console.error("Local stream is not available");
  }

  console.log("PeerConnection created");
  return pc;
};

export const setAndSendLocalDescription = async (pc, sessionDescription, sendData) => {
  try {
    await pc.setLocalDescription(sessionDescription);
    console.log("Local description set");
    sendData({
      type: sessionDescription.type,
      sdp: sessionDescription.sdp,
    });
  } catch (error) {
    console.error("Failed to set local description: ", error);
  }
};

export const signalingDataHandler = async (pc, data, sendData) => {
  if (!data || !data.type) {
    console.log("Received data without type:", data);
    return;
  }

  try {
    if (data.type === "offer") {
      await pc.setRemoteDescription(new RTCSessionDescription(data));
      await sendAnswer(pc, sendData);
    } else if (data.type === "answer") {
      await pc.setRemoteDescription(new RTCSessionDescription(data));
    } else if (data.type === "candidate") {
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    } else {
      console.log("Unknown Data Type:", data.type);
    }
  } catch (error) {
    console.error("Error handling signaling data: ", error);
  }
};

export const sendOffer = async (pc, sendData) => {
  try {
    console.log("Sending offer");
    const offer = await pc.createOffer();
    await setAndSendLocalDescription(pc, offer, sendData);
  } catch (error) {
    console.error("Send offer failed: ", error);
  }
};

export const sendAnswer = async (pc, sendData) => {
  try {
    console.log("Sending answer");
    const answer = await pc.createAnswer();
    await setAndSendLocalDescription(pc, answer, sendData);
  } catch (error) {
    console.error("Send answer failed: ", error);
  }
};

export const createSocketConnection = (url) => {
  return socketio(url, { autoConnect: false });
};
