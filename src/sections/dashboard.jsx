import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../redux/sidebarSlice";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useSelector((state) => state.user.userInfo.user);
  const dispatch = useDispatch();

  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleClick = (name) => {
    setActiveLink(name);
  };

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar()); // Dispatch to toggle sidebar state
  };

  useEffect(() => {
    if (!user || !user.id) return;
    // Fetch unread messages count when app initializes or after user logs in
    const fetchUnreadCount = async () => {
      const userId = user.id; // Replace with actual logic to get the logged-in user's ID
      try {
        const response = await fetch(
          `${BACKEND_URL}/chat/unread-global-messages/${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.length); // Assume the API response has a `count` property
        } else {
          console.error("Failed to fetch unread messages count");
        }
      } catch (error) {
        console.error("Error fetching unread messages:", error);
      }
    };

    fetchUnreadCount();
  });

  return (
    <div
      className={`p-3 bg-white text-sm h-screen transition-all duration-300 box-shadow-form ${
        isSidebarOpen
          ? "absolute top-0 left-0 z-50 w-[16rem] translate-x-0 lg:relative lg:w-[16rem]"
          : "absolute top-0 w-[16rem] z-50 lg:relative lg:w-[4rem] lg:block lg:translate-x-0 -translate-x-full"
      }`}
    >
      {/* Sidebar content here */}
      <div className={`flex flex-col flex-shrink-0 sticky top-3`}>
        <div className="flex justify-center text-[#8898AA] gap-6">
          <Link
            to="/home"
            className="flex justify-center items-center my-1  no-underline"
          >
            <div>
              <i className="fa-solid fa-map-location-dot py-2"></i>
              {isSidebarOpen && (
                <span className="text-xl ml-2 ">Lingolandias</span>
              )}{" "}
            </div>
          </Link>
          <button onClick={handleSidebarToggle} className="text-2xl lg:hidden">
            {isSidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </button>
        </div>
        <hr className="my-2" />

        <ul className="flex flex-col">
          <li>
            <Link
              to="/home"
              className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                activeLink === "/home"
                  ? "bg-[#273296] text-white"
                  : "text-[#8898AA] hover:bg-slate-100"
              } ${isSidebarOpen ? "" : "justify-center"}`} // Center icons when sidebar is closed
              onClick={() => handleClick("/home")}
            >
              <i className="fa-solid fa-gauge-high py-1"></i>
              {isSidebarOpen && <span className="ml-2 ">Dashboard</span>}{" "}
              {/* Added ml-2 */}
            </Link>
          </li>
          <li>
            <Link
              to="/schedule"
              className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                activeLink === "/schedule"
                  ? "bg-[#273296] text-white"
                  : "text-[#8898AA] hover:bg-slate-100"
              } ${isSidebarOpen ? "" : "justify-center"}`} // Center icons when sidebar is closed
              onClick={() => handleClick("/schedule")}
            >
              <i className="fa-solid fa-calendar-days py-1"></i>
              {isSidebarOpen && <span className="ml-2">My Schedule</span>}{" "}
              {/* Added ml-2 */}
            </Link>
          </li>
          <li>
            <Link
              to="/learning"
              className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                activeLink === "/learning"
                  ? "bg-[#273296] text-white"
                  : "text-[#8898AA] hover:bg-slate-100"
              } ${isSidebarOpen ? "" : "justify-center"}`} // Center icons when sidebar is closed
              onClick={() => handleClick("/learning")}
            >
              <i className="fa-solid fa-graduation-cap py-1"></i>
              {isSidebarOpen && <span className="ml-2">Learning</span>}{" "}
              {/* Added ml-2 */}
            </Link>
          </li>
          <li>
            <Link
              to="/messages"
              className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                activeLink === "/messages"
                  ? "bg-[#273296] text-white"
                  : "text-[#8898AA] hover:bg-slate-100"
              } ${isSidebarOpen ? "" : "justify-center"}`} // Center icons when sidebar is closed
              onClick={() => handleClick("/messages")}
            >
              <i className="fa-solid fa-comments py-1"></i>
              {isSidebarOpen && (
                <span className="ml-2">
                  Messages{" "}
                  {unreadCount > 0 && (
                    <span
                      className={`${
                        !activeLink ? "text-white" : "text-red-500 font-bold"
                      }`}
                    >
                      {unreadCount} new
                    </span>
                  )}
                </span>
              )}
              {/* Added ml-2 */}
            </Link>
          </li>
        </ul>
        <hr className="my-2" />

        <ul className="flex flex-col mb-auto">
          <li>
            <Link
              to="/profile"
              className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                activeLink === "/profile"
                  ? "bg-[#273296] text-white"
                  : "text-[#8898AA] hover:bg-slate-100"
              } ${isSidebarOpen ? "" : "justify-center"}`} // Center icons when sidebar is closed
              onClick={() => handleClick("/profile")}
            >
              <i className="fa-solid fa-user py-1"></i>
              {isSidebarOpen && <span className="ml-2">Profile</span>}{" "}
              {/* Added ml-2 */}
            </Link>
          </li>
          {user && user.role === "admin" && (
            <li>
              <Link
                to="/admin"
                className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                  activeLink === "/admin"
                    ? "bg-[#273296] text-white"
                    : "text-[#8898AA] hover:bg-slate-100"
                } ${isSidebarOpen ? "" : "justify-center"}`} // Center icons when sidebar is closed
                onClick={() => handleClick("/admin")}
              >
                <i className="fa-solid fa-unlock py-1"></i>
                {isSidebarOpen && <span className="ml-2">Admin</span>}{" "}
                {/* Added ml-2 */}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
