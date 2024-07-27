import { useState, useEffect } from "react";
import avatar from "../assets/logos/avatar.jpg";
import { useLogout } from "../hooks/customHooks";

const Navbar = () => {
  const logout = useLogout();
  const [url, setUrl] = useState(null);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    fetch("http://195.110.58.68:3001/userdata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.avatarUrl);
        setName(data.name);
        setLastName(data.lastName);
      })
      .catch((error) => console.error("Error:", error));
  }, []);
  return (
    <header className="w-full flex justify-between items-center ">
      <h2 className="text-white font-semibold text-[0.9375rem]">USER PROFILE</h2>

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
               src={!url ? avatar : url}
              alt="avatar"
              className="w-[2.3rem] rounded-full"
            />
            <p className="text-white">{name} {lastName}</p>
          </a>
          {isDropdownOpen && (
            <div className="absolute top-[2.6REM] right-0 mt-2 w-48 bg-white text-[#8898AA] rounded-md shadow-lg py-2">
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
                onClick={logout}
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
