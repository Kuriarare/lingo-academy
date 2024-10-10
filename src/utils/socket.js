// Socket.js - create a separate file for socket connection
import { io } from "socket.io-client";

const LOCAL_HOST = "http://localhost:8000";
const socket = io(LOCAL_HOST);

export default socket;
