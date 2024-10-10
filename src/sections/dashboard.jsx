import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("");
  const user = useSelector((state) => state.user.userInfo.user);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleClick = (name) => {
    setActiveLink(name);
  };

  return (
    <div className="p-3 bg-white text-sm h-full 2xl:w-[16rem] md:w-[15rem] relative box-shadow-form ">
      <div className="flex flex-col flex-shrink-0 sticky top-3">
        <Link to="/home" className="flex justify-center items-center mb-3 text-[#8898AA] no-underline">
          <i className="fa-solid fa-map-location-dot mr-2"></i>
          <span className="text-xl">Lingolandias</span>
        </Link>
        <hr className="my-2" />

        <ul className="flex flex-col">
          <li>
            <Link
              to="/home"
              className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                activeLink === "/home" ? "bg-[#273296] text-white" : "text-[#8898AA] hover:bg-slate-100"
              }`}
              onClick={() => handleClick("/home")}
            >
              <i className="fa-solid fa-gauge-high mr-2"></i>
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/schedule"
              className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                activeLink === "/schedule" ? "bg-[#273296] text-white" : "text-[#8898AA] hover:bg-slate-100"
              }`}
              onClick={() => handleClick("/schedule")}
            >
              <i className="fa-solid fa-calendar-days mr-2"></i>
              My Schedule
            </Link>
          </li>
          <li>
            <Link
              to="/learning"
              className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                activeLink === "/learning" ? "bg-[#273296] text-white" : "text-[#8898AA] hover:bg-slate-100"
              }`}
              onClick={() => handleClick("/learning")}
            >
              <i className="fa-solid fa-graduation-cap mr-2"></i>
              Learning
            </Link>
          </li>
          <li>
            <Link
              to="/teachers"
              className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                activeLink === "/teachers" ? "bg-[#273296] text-white" : "text-[#8898AA] hover:bg-slate-100"
              }`}
              onClick={() => handleClick("/teachers")}
            >
              <i className="fa-solid fa-chalkboard-user mr-2"></i>
              Teachers
            </Link>
          </li>
          {/* <li>
            <Link
              to="/progress"
              className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                activeLink === "/progress" ? "bg-purple-500 text-white" : "text-[#8898AA] hover:bg-slate-100"
              }`}
              onClick={() => handleClick("/progress")}
            >
              <i className="fa-solid fa-spinner mr-2"></i>
              Progress
            </Link>
          </li> */}
        </ul>
        <hr className="my-2" />

        <ul className="flex flex-col mb-auto">
          {/* <li>
            <Link
              to="#"
              className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                activeLink === "#" ? "bg-purple-500 text-white" : "text-[#8898AA] hover:bg-slate-100"
              }`}
              onClick={() => handleClick("#")}
            >
              <i className="fa-solid fa-house-user mr-2"></i>
              Home
            </Link>
          </li> */}
          <li>
            <Link
              to="/profile"
              className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                activeLink === "/profile" ? "bg-[#273296] text-white" : "text-[#8898AA] hover:bg-slate-100"
              }`}
              onClick={() => handleClick("/profile")}
            >
              <i className="fa-solid fa-user mr-2"></i>
              Profile
            </Link>
          </li>
          {/* <li>
            <Link
              to="/option3"
              className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                activeLink === "/option3" ? "bg-purple-500 text-white" : "text-[#8898AA] hover:bg-slate-100"
              }`}
              onClick={() => handleClick("/option3")}
            >
              <i className="fa-solid fa-spinner mr-2"></i>
              Option 3
            </Link>
          </li> */}
          {user && user.role === 'admin' && (
            <li>
              <Link
                to="/admin"
                className={`flex items-center py-2 px-4 rounded-md transition-colors duration-200 ${
                  activeLink === "/admin" ? "bg-[#273296] text-white" : "text-[#8898AA] hover:bg-slate-100"
                }`}
                onClick={() => handleClick("/admin")}
              >
                <i className="fa-solid fa-unlock mr-2"></i>
                Admin
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;