import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../redux/sidebarSlice";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { fetchUnreadMessages } from "../redux/messageSlice";
import { io } from "socket.io-client";
import { Slide, ToastContainer, toast } from "react-toastify";
import { fetchMessagesForTeacher, fetchUnreadCountsForStudent } from "../redux/chatSlice";
import { updateUserStatus } from "../redux/userSlice";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");

  const dispatch = useDispatch();
  const unreadCountsByRoom = useSelector((state) => state.chat.unreadCountsByRoom);
  const studentUnreadCount = useSelector((state) => state.chat.studentUnreadCount);
  const user = useSelector((state) => state.user.userInfo.user);
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);
  const { totalUnread } = useSelector((state) => state.messages);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleClick = (name) => {
    setActiveLink(name);
  };

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  // Message fetching effects
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUnreadMessages(user.id));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (user?.role === 'teacher' && user?.students?.length > 0) {
      dispatch(fetchMessagesForTeacher());
    } else if (user?.role === 'user') {
      dispatch(fetchUnreadCountsForStudent());
    }
  }, [user?.role, user?.students, dispatch]);

  // Socket.io connection
  useEffect(() => {
    let socket;
    
    if (user?.id) {
      socket = io(`${BACKEND_URL}`, {
        autoConnect: true,
        reconnection: true
      });

      socket.on("userStatus", (data) => {
        const { id, online, name } = data;
        toast(
          <div>
            <b>{name}</b> is now {online}
          </div>,
          {
            position: "bottom-left",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
          }
        );
        dispatch(updateUserStatus({ id, online }));
      });

      socket.on("newUnreadGlobalMessage", () => {
        dispatch(fetchUnreadMessages(user.id));
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });
    }

    return () => {
      if (socket) {
        socket.off("userStatus");
        socket.off("newUnreadGlobalMessage");
        socket.disconnect();
      }
    };
  }, [user?.id, dispatch]);

  // Calculate unreads based on role
  const getScheduleUnreads = () => {
    if (user?.role === 'teacher') {
      return Object.values(unreadCountsByRoom).reduce((sum, count) => sum + count, 0);
    }
    if (user?.role === 'user') {
      // Students only have their teacher's unreads
      return studentUnreadCount || 0;
    }
    return 0;
  };

  const totalScheduleUnread = getScheduleUnreads();

  return (
    <div
      className={`p-4 bg-white h-screen transition-all duration-300 shadow-xl border-r border-gray-100 ${
        isSidebarOpen
          ? "absolute top-0 left-0 z-50 w-64 translate-x-0 lg:relative lg:w-64"
          : "absolute top-0 w-64 z-50 lg:relative lg:w-16 lg:block lg:translate-x-0 -translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 px-2">
          <Link
            to="/home"
            className={`flex items-center no-underline group ${
              isSidebarOpen ? "gap-3" : "justify-center w-full"
            }`}
          >
            <div className="bg-[#9E2FD0] p-2 rounded-lg group-hover:bg-[#1a237e] transition-colors">
              <i className="fa-solid fa-map-location-dot text-white text-xl"></i>
            </div>
            {isSidebarOpen && (
              <span className="text-2xl font-bold text-[#9E2FD0] tracking-tight">
                Lingolandias
              </span>
            )}
          </Link>
          <button 
            onClick={handleSidebarToggle} 
            className="lg:hidden p-2 hover:bg-gray-100 rounded-full text-[#9E2FD0]"
          >
            {isSidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col gap-1">
          <ul className="space-y-1">
            {[
              { to: "/home", icon: "fa-gauge-high", text: "Dashboard" },
              { to: "/schedule", icon: "fa-calendar-days", text: "My Schedule" },
              { to: "/learning", icon: "fa-graduation-cap", text: "Learning" },
              { to: "/messages", icon: "fa-comments", text: "Messages" },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`group relative flex items-center p-3 rounded-xl transition-all duration-200 ${
                    activeLink === item.to
                      ? "bg-[#9E2FD0] text-white shadow-md"
                      : "text-[#6b7280] hover:bg-gray-50 hover:text-[#273296] hover:translate-x-1"
                  } ${
                    isSidebarOpen ? "gap-3" : "justify-center"
                  }`}
                  onClick={() => handleClick(item.to)}
                >
                  <i className={`fa-solid ${item.icon} text-lg w-6 text-center`} />
                  {isSidebarOpen && (
                    <span className="font-medium">{item.text}</span>
                  )}
                  
                  {/* Messages Notification Badge */}
                  {item.to === "/messages" && totalUnread > 0 && (
                    <span className={`${
                      isSidebarOpen 
                        ? "bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto"
                        : `absolute top-1 right-1 bg-red-500 w-4 h-4 rounded-full text-[9px] 
                           flex items-center justify-center text-white transition-all
                           group-hover:w-auto group-hover:px-2 group-hover:min-w-[1.5rem]`
                    }`}>
                      {isSidebarOpen ? totalUnread : (
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          {totalUnread}
                        </span>
                      )}
                    </span>
                  )}

                  {/* Schedule Notification Badge */}
                  {item.to === "/schedule" && totalScheduleUnread > 0 && (
                    <span className={`${
                      isSidebarOpen 
                        ? "bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto"
                        : `absolute top-1 right-1 bg-red-500 w-4 h-4 rounded-full text-[9px] 
                           flex items-center justify-center text-white transition-all
                           group-hover:w-auto group-hover:px-2 group-hover:min-w-[1.5rem]`
                    }`}>
                      {isSidebarOpen ? totalScheduleUnread : (
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          {totalScheduleUnread}
                        </span>
                      )}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Bottom Section */}
          <div className="mt-auto border-t border-gray-100 pt-4">
            <ul className="space-y-1">
              {[
                { to: "/profile", icon: "fa-user", text: "Profile" },
                ...(user?.role === "admin" 
                  ? [{ to: "/admin", icon: "fa-unlock", text: "Admin" }] 
                  : [])
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                      activeLink === item.to
                        ? "bg-[#9E2FD0] text-white shadow-md"
                        : "text-[#6b7280] hover:bg-gray-50 hover:text-[#273296] hover:translate-x-1"
                    } ${
                      isSidebarOpen ? "gap-3" : "justify-center"
                    }`}
                    onClick={() => handleClick(item.to)}
                  >
                    <i className={`fa-solid ${item.icon} text-lg w-6 text-center`} />
                    {isSidebarOpen && (
                      <span className="font-medium">{item.text}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
      <div className="absolute top-4 lg:right-[-36rem] right-2">
        <ToastContainer />
      </div>
    </div>
  );
};

export default Dashboard;