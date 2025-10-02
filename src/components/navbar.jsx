import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import avatar from "../assets/logos/avatar.jpg";
import { useLogout } from "../hooks/customHooks";
import { logout } from "../redux/userSlice";
import { toggleSidebar } from "../redux/sidebarSlice";
import "react-toastify/dist/ReactToastify.css";
import { FiChevronLeft, FiChevronRight, FiUser, FiSettings, FiHelpCircle, FiLogOut, FiBookOpen, FiBell } from "react-icons/fi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Navbar = ({ header }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo.user);
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const logoutAndNavigate = useLogout();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = async () => {
    dispatch(logout());
    logoutAndNavigate();
    try {
      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  return (
    <header className="w-full flex justify-between items-center py-3">
      <div className="flex items-center gap-4">
        <button
          onClick={handleSidebarToggle}
          className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
        >
          {isSidebarOpen ? (
            <FiChevronLeft size={22} />
          ) : (
            <FiChevronRight size={22} />
          )}
        </button>
        <h2 className="text-xl font-bold text-white">{header}</h2>
      </div>

      <nav className="flex items-center gap-5">
        <button className="relative text-white hover:bg-white/10 p-2 rounded-full transition-colors">
          <FiBell size={24} />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
        </button>
        
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="group flex items-center gap-3"
          >
            <div className="relative">
              <img
                src={!user?.avatarUrl ? avatar : user.avatarUrl}
                alt="avatar"
                className="w-11 h-11 object-cover rounded-full border-2 border-white/50 shadow-md transform group-hover:scale-105 transition-transform"
              />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-white">
                {user?.name} {user?.lastName}
              </p>
              <p className="text-xs text-white/80">
                {user?.role === 'user' 
                  ? 'Student' 
                  : user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </p>
            </div>
          </button>
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 top-16 w-64 bg-white rounded-xl shadow-2xl py-3 z-50 animate-fade-in-down border border-gray-100"
            >
              <div className="px-5 py-3 border-b border-gray-200">
                <p className="text-base font-bold text-gray-900">
                  {user?.name} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>

              <div className="py-2">
                <a
                  href="/profile"
                  className="flex items-center gap-4 px-5 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                >
                  <FiUser className="w-5 h-5" />
                  Profile
                </a>
                <a
                  href="/settings"
                  className="flex items-center gap-4 px-5 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                >
                  <FiSettings className="w-5 h-5" />
                  Settings
                </a>
                <a
                  href="#"
                  className="flex items-center gap-4 px-5 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                >
                  <FiBookOpen className="w-5 h-5" />
                  Guide
                </a>
                <a
                  href="/help-center"
                  className="flex items-center gap-4 px-5 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                >
                  <FiHelpCircle className="w-5 h-5" />
                  Help Center
                </a>
              </div>

              <div className="border-t border-gray-200 my-2"></div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
                Log Out
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
