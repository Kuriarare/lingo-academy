// import { useState, useEffect, useRef } from 'react';
// import { io } from 'socket.io-client';
// import axios from 'axios';

// const ChatWindow = ({ username, room }) => {
//   const [socket, setSocket] = useState(null);
//   const [message, setMessage] = useState('');
//   const [chatMessages, setChatMessages] = useState([]);

//   // Ref to the messages container
//   const messagesEndRef = useRef(null);

//   // Function to format time to HH:mm
//   const formatTime = (date) => {
//     return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   // Fetch previous messages from the server
//   const fetchMessages = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8000/messages/${room}`);
//       setChatMessages(response.data.reverse()); // Reverse to display oldest first
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   };

//   useEffect(() => {
//     if (username && room) {
//       const socketInstance = io('http://localhost:8000');
//       setSocket(socketInstance);

//       // Fetch existing messages when component mounts
//       fetchMessages();

//       // Join the room
//       socketInstance.emit('join', { username, room });

//       // Handle incoming chat messages
//       socketInstance.on('chat', (data) => {
//         setChatMessages((prevMessages) => [...prevMessages, data]);
//       });

//       return () => {
//         socketInstance.disconnect();
//       };
//     }
//   }, [username, room]);

//   // Scroll to the bottom of the messages container whenever chatMessages changes
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [chatMessages]);

//   const sendMessage = () => {
//     if (message && room) {
//       const timestamp = new Date(); // Register the send time
//       socket.emit('chat', { username, room, message, timestamp });
//       setMessage('');
//     }
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === 'Enter') {
//       event.preventDefault(); // Prevent default behavior of Enter key
//       sendMessage();
//     }
//   };

//   return (
//     <div className="h-[600px] flex flex-col border p-3  bg-white">
//       <h2 className="mb-4 text-center">Chat</h2>

//       <div className="flex-1 overflow-y-auto mb-4 pr-1">
//         <h3>Chat Messages:</h3>
//         <ul>
//           {chatMessages.map((msg, index) => {
//             const showTimestamp = index === 0 || new Date(msg.timestamp) - new Date(chatMessages[index - 1].timestamp) > 3 * 60 * 1000;

//             return (
//               <div key={index}>
//                 {/* Show the time only if more than 3 minutes have passed since the last message */}
//                 {showTimestamp && (
//                   <div className="text-center text-gray-500 text-[12px]">
//                     {formatTime(msg.timestamp)}
//                   </div>
//                 )}
//                 <li 
//                   className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'} mb-2 text-[15px]`}
//                 >
//                   <div 
//                     className={`p-2 rounded-lg max-w-xs ${msg.username === username ? 'bg-blue-500 text-white text-right' : 'bg-gray-300 text-black text-left text-[15px]'}`}
//                   >
//                     {msg.username !== username && <strong>{msg.username}: </strong>}
//                     {msg.message}
//                   </div>
//                 </li>
//               </div>
//             );
//           })}
//           {/* Scroll to bottom indicator */}
//           <div ref={messagesEndRef} />
//         </ul>
//       </div>

//       <div className="flex-shrink-0 flex">
//         <input 
//           type="text" 
//           placeholder="Message" 
//           value={message} 
//           onChange={(e) => setMessage(e.target.value)} 
//           onKeyDown={handleKeyDown}
//           className="flex-1 p-2 border rounded-l"
//         />
//         <button 
//           onClick={sendMessage} 
//           className="p-2 bg-blue-500 text-white rounded-r"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;


// server {
//     server_name backend.srv570363.hstgr.cloud www.backend.srv570363.hstgr.cloud;

//     # Directorio raíz donde se encuentran los archivos estáticos de tu cliente React/Vite
//     root /var/www/lingo-academy-client;
    
//     # Configuración para servir los archivos estáticos del cliente
//     location / {
//         try_files $uri $uri/ /index.html;  # Intenta servir archivos directos, y si no los encuentra, carga index.html
//     }

//     listen [::]:443 ssl ipv6only=on; # managed by Certbot
//     listen 443 ssl; # managed by Certbot
//     ssl_certificate /etc/letsencrypt/live/backend.srv570363.hstgr.cloud/fullchain.pem; # managed by Certbot
//     ssl_certificate_key /etc/letsencrypt/live/backend.srv570363.hstgr.cloud/privkey.pem; # managed by Certbot
//     include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
//     ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
// }

// server {
//     if ($host = www.backend.srv570363.hstgr.cloud) {
//         return 301 https://$host$request_uri;
//     } # managed by Certbot

//     if ($host = backend.srv570363.hstgr.cloud) {
//         return 301 https://$host$request_uri;
//     } # managed by Certbot

//     listen 80;
//     listen [::]:80;

//     server_name backend.srv570363.hstgr.cloud www.backend.srv570363.hstgr.cloud;
//     return 404; # managed by Certbot
// }

