import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../redux/sidebarSlice";
import { FiHome, FiCalendar, FiBookOpen, FiMessageSquare, FiUser, FiLogIn, FiSettings, FiHelpCircle, FiUsers, FiChevronLeft, FiVideo, FiGrid } from "react-icons/fi";
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

  const getScheduleUnreads = () => {
    if (user?.role === 'teacher') {
      return Object.values(unreadCountsByRoom).reduce((sum, count) => sum + count, 0);
    }
    if (user?.role === 'user') {
      return studentUnreadCount || 0;
    }
    return 0;
  };

  const totalScheduleUnread = getScheduleUnreads();

  const navLinks = [
    { to: "/home", icon: <FiHome />, text: "Dashboard" },
    user?.role === "admin"
      ? { to: "/schedule", icon: <FiVideo />, text: "Meetings" }
      : { to: "/schedule", icon: <FiCalendar />, text: "My Schedule", unread: totalScheduleUnread },
    { to: "/learning", icon: <FiBookOpen />, text: "Learning" },
    { to: "/messages", icon: <FiMessageSquare />, text: "Messages", unread: totalUnread },
    { to: "/trello", icon: <FiGrid />, text: "Trello" },
  ];

  const bottomLinks = [
    { to: "/profile", icon: <FiUser />, text: "Profile" },
    ...(user?.role === "admin" ? [{ to: "/admin", icon: <FiUsers />, text: "Admin" }] : []),
    { to: "/settings", icon: <FiSettings />, text: "Settings" },
    { to: "/help-center", icon: <FiHelpCircle />, text: "Help Center" },
  ];

  return (
    <div
      className={`h-screen bg-white dark:bg-brand-dark-secondary shadow-lg border-r border-gray-200 dark:border-purple-500/20 flex flex-col transition-all duration-300 fixed top-0 left-0 z-50 lg:sticky lg:top-0 ${
        isSidebarOpen
          ? "w-64 translate-x-0"
          : "w-64 -translate-x-full lg:w-20 lg:translate-x-0"
      }`}
    >
      <div className="flex items-center justify-center py-6 border-b border-gray-200 dark:border-purple-500/20 px-4">
        <Link to="/home" className="flex items-center gap-3">
          <div className="bg-[#8E44AD] dark:bg-brand-purple text-white w-10 h-10 flex items-center justify-center rounded-lg text-2xl font-bold">
            L
          </div>
          {isSidebarOpen && (
            <span className="text-2xl font-bold text-[#8E44AD] dark:text-white tracking-tight">
              Lingolandias
            </span>
          )}
        </Link>
        {isSidebarOpen && (
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 p-2 rounded-full"
          >
            <FiChevronLeft size={22} />
          </button>
        )}
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-4 py-6">
        <ul className="space-y-2">
          {navLinks.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`group relative flex items-center p-3 rounded-xl transition-all duration-300 ${
                  activeLink === item.to
                    ? "bg-[#8E44AD] dark:bg-brand-purple text-white shadow-lg transform -translate-y-1"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#8E44AD] dark:hover:text-white"
                } ${isSidebarOpen ? "gap-4" : "justify-center"}`}
                onClick={() => handleClick(item.to)}
              >
                <div className="text-xl">{item.icon}</div>
                {isSidebarOpen && (
                  <span className="font-semibold">{item.text}</span>
                )}
                {item.unread > 0 && (
                  <span className={`absolute text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isSidebarOpen 
                      ? "right-3 top-1/2 -translate-y-1/2 w-6 h-6"
                      : "top-1 right-1 w-5 h-5"
                  }`}>
                    {item.unread}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6 border-t border-gray-200 dark:border-purple-500/20">
          <ul className="space-y-2">
            {bottomLinks.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`group relative flex items-center p-3 rounded-xl transition-all duration-300 ${
                    activeLink === item.to
                      ? "bg-[#8E44AD] dark:bg-brand-purple text-white shadow-lg"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-[#8E44AD] dark:hover:text-white"
                  } ${isSidebarOpen ? "gap-4" : "justify-center"}`}
                  onClick={() => handleClick(item.to)}
                >
                  <div className="text-xl">{item.icon}</div>
                  {isSidebarOpen && (
                    <span className="font-semibold">{item.text}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="absolute top-4 lg:right-[-36rem] right-2">
        <ToastContainer />
      </div>
    </div>
  );
};

export default Dashboard;