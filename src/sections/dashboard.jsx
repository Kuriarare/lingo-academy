import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");
  const user = useSelector((state) => state.user.userInfo.user);

  const isSidebarOpen = useSelector((state) => state.sidebar.isSidebarOpen); // Get sidebar visibility state from Redux

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleClick = (name) => {
    setActiveLink(name);
  };

  return (
    <div
      className={`p-3 bg-white text-sm h-screen relative box-shadow-form transition-all duration-300 ${
        isSidebarOpen ? 'w-[16rem]' : 'w-[4rem]'
      }`}
    >
      {/* Sidebar content here */}
      <div className={`flex flex-col flex-shrink-0 sticky top-3`}>
        <Link
          to="/home"
          className="flex justify-center items-center my-1 text-[#8898AA] no-underline"
        >
          <i className="fa-solid fa-map-location-dot py-2"></i>
          {isSidebarOpen && <span className="text-xl ml-2 ">Lingolandias</span>} {/* Added ml-2 */}
        </Link>
        <hr className="my-2" />

        <ul className="flex flex-col">
          <li>
            <Link
              to="/home"
              className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                activeLink === "/home"
                  ? "bg-[#273296] text-white"
                  : "text-[#8898AA] hover:bg-slate-100"
              } ${isSidebarOpen ? '' : 'justify-center'}`} // Center icons when sidebar is closed
              onClick={() => handleClick("/home")}
            >
              <i className="fa-solid fa-gauge-high py-1"></i>
              {isSidebarOpen && <span className="ml-2 ">Dashboard</span>} {/* Added ml-2 */}
            </Link>
          </li>
          <li>
            <Link
              to="/schedule"
              className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                activeLink === "/schedule"
                  ? "bg-[#273296] text-white"
                  : "text-[#8898AA] hover:bg-slate-100"
              } ${isSidebarOpen ? '' : 'justify-center'}`} // Center icons when sidebar is closed
              onClick={() => handleClick("/schedule")}
            >
              <i className="fa-solid fa-calendar-days py-1"></i>
              {isSidebarOpen && <span className="ml-2">My Schedule</span>} {/* Added ml-2 */}
            </Link>
          </li>
          <li>
            <Link
              to="/learning"
              className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                activeLink === "/learning"
                  ? "bg-[#273296] text-white"
                  : "text-[#8898AA] hover:bg-slate-100"
              } ${isSidebarOpen ? '' : 'justify-center'}`} // Center icons when sidebar is closed
              onClick={() => handleClick("/learning")}
            >
              <i className="fa-solid fa-graduation-cap py-1"></i>
              {isSidebarOpen && <span className="ml-2">Learning</span>} {/* Added ml-2 */}
            </Link>
          </li>
          <li>
            <Link
              to="/messages"
              className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                activeLink === "/messages"
                  ? "bg-[#273296] text-white"
                  : "text-[#8898AA] hover:bg-slate-100"
              } ${isSidebarOpen ? '' : 'justify-center'}`} // Center icons when sidebar is closed
              onClick={() => handleClick("/messages")}
            >
              <i className="fa-solid fa-comments py-1"></i>
              {isSidebarOpen && <span className="ml-2">Messages</span>} {/* Added ml-2 */}
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
              } ${isSidebarOpen ? '' : 'justify-center'}`} // Center icons when sidebar is closed
              onClick={() => handleClick("/profile")}
            >
              <i className="fa-solid fa-user py-1"></i>
              {isSidebarOpen && <span className="ml-2">Profile</span>} {/* Added ml-2 */}
            </Link>
          </li>
          {user && user.role === 'admin' && (
            <li>
              <Link
                to="/admin"
                className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                  activeLink === "/admin"
                    ? "bg-[#273296] text-white"
                    : "text-[#8898AA] hover:bg-slate-100"
                } ${isSidebarOpen ? '' : 'justify-center'}`} // Center icons when sidebar is closed
                onClick={() => handleClick("/admin")}
              >
                <i className="fa-solid fa-unlock py-1"></i>
                {isSidebarOpen && <span className="ml-2">Admin</span>} {/* Added ml-2 */}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
