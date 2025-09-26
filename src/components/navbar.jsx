import { useState, useEffect, useRef } from "react"; // Import useRef
import { useSelector, useDispatch } from "react-redux";
import avatar from "../assets/logos/avatar.jpg";
import { useLogout } from "../hooks/customHooks";
import { logout } from "../redux/userSlice";
import { toggleSidebar } from "../redux/sidebarSlice";
// import { io } from "socket.io-client";
// import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Navbar = ({ header }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo.user);
  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Set default as false
  const dropdownRef = useRef(null); // Create a reference for the dropdown

  const logoutAndNavigate = useLogout();

  // useEffect(() => {
  //   const socket = io(`${BACKEND_URL}`);
  //   socket.on("userStatus", (data) => {
  //     const { id, online, name } = data;
  //     toast(
  //       <div>
  //         <b>{name}</b> is now {online}
  //       </div>,
  //       {
  //         position: "bottom-right",
  //         autoClose: 2000,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //         transition: Slide,
  //       }
  //     );

  //     dispatch(updateUserStatus({ id, online }));
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [user, dispatch]);

  // Close the dropdown when clicking outside
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
    if (user?.email === "christian.lingolandias.com@gmail.com") {
      alert("Ya se va el hom :( ?");
    }
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
    <header className="w-full flex justify-between items-center   ">
      <div className="flex items-center gap-4">
        <button
          onClick={handleSidebarToggle}
          className="text-white hover:bg-[#273296] p-2 rounded-lg transition-colors"
        >
          {isSidebarOpen ? (
            <FiChevronLeft size={24} className="shrink-0" />
          ) : (
            <FiChevronRight size={24} className="shrink-0" />
          )}
        </button>
        <h2 className="text-white text-lg font-semibold">{header}</h2>
      </div>

      <nav className="flex items-center gap-6">
        <div className="relative flex items-center gap-3">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="group flex items-center gap-2 hover:bg-gray-100 rounded-full p-1 pr-3 transition-colors"
            >
              <div className="relative">
                <img
                  src={!user?.avatarUrl ? avatar : user.avatarUrl}
                  alt="avatar"
                  className="w-10 h-10 object-cover rounded-full border-2 border-white shadow-sm"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-white group-hover:text-[#273296] font-medium hidden md:inline-block">
                {user?.name} {user?.lastName}
              </span>
              <i
                className={`fa-solid fa-chevron-down text-white group-hover:text-[#273296] text-sm transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              ></i>
            </button>
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-14 w-56 bg-white rounded-lg shadow-xl py-2 z-50 animate-fade-in"
              >
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-sm font-medium text-[#273296]">
                    {user?.name} {user?.lastName}
                  </p>
                  <p className="text-xs text-[#6b7280] truncate">
                    {user?.email}
                  </p>
                </div>

                <div className="py-2">
                  <a
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4a5568] hover:bg-gray-50 transition-colors"
                  >
                    <i className="fa-solid fa-user w-5 text-center text-[#273296]"></i>
                    Profile
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4a5568] hover:bg-gray-50 transition-colors"
                  >
                    <i className="fa-solid fa-cog w-5 text-center text-[#273296]"></i>
                    Settings
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4a5568] hover:bg-gray-50 transition-colors"
                  >
                    <i className="fa-solid fa-book w-5 text-center text-[#273296]"></i>
                    Guide
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4a5568] hover:bg-gray-50 transition-colors"
                  >
                    <i className="fa-solid fa-life-ring w-5 text-center text-[#273296]"></i>
                    Help Center
                  </a>
                </div>

                <div className="border-t border-gray-100 my-2"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <i className="fa-solid fa-sign-out-alt w-5 text-center"></i>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Keep ToastContainer exactly as in original
      <div className="absolute top-4 right-2">
        <ToastContainer />
      </div> */}
    </header>
  );
};

export default Navbar;
