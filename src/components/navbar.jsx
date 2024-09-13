import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import avatar from "../assets/logos/avatar.jpg";
import { useLogout } from "../hooks/customHooks";
import { logout } from "../redux/userSlice";

const Navbar = ({header}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const logoutAndNavigate = useLogout();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    logoutAndNavigate();
  };

  return (
    <header className="w-full flex justify-between items-center ">
      <h2 className="text-white font-semibold text-[0.9375rem]">
        {header}
      </h2>

      <nav className="flex gap-10">
        <div className="relative">
          <input
            type="search"
            className="border-2 border-[#FFFFFF99] text-white bg-transparent rounded-full h-11 w-[20rem] pl-10 pr-6 focus:outline-none"
            placeholder="Search"
          />

          <i className="fa-solid fa-magnifying-glass absolute left-0 top-[0.3rem] mt-3 ml-4 text-[#FFFFFF99]"></i>
        </div>
        <div className="relative flex">
          <a
            className="flex items-center gap-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            <img
              src={!user?.avatarUrl ? avatar : user.avatarUrl}
              alt="avatar"
              className="w-[2.3rem] h-[2.3rem] object-cover rounded-full"
            />

            <p className="text-white">
              {user?.name} {user?.lastName}
            </p>
          </a>
          {isDropdownOpen && (
            <div className="absolute top-[2.6REM] right-0 mt-2 w-48 bg-white text-[#8898AA] rounded-md shadow-lg py-2 z-10">
              <a
                href="/profile"
                className="flex items-center gap-2 px-4 py-2  hover:bg-gray-100"
              >
                <i className="fa-solid fa-user"></i> Profile
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2  hover:bg-gray-100"
              >
                <i className="fa-solid fa-cog"></i> Settings
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2  hover:bg-gray-100"
              >
                <i className="fa-solid fa-book"></i> Guide
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-4 py-2  hover:bg-gray-100"
              >
                <i className="fa-solid fa-life-ring"></i> Help Center
              </a>
              <div className="border-t my-2"></div>
              <a
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2  hover:bg-gray-100 cursor-pointer"
              >
                <i className="fa-solid fa-sign-out-alt"></i> Log Out
              </a>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
