import { useState } from "react";
import Swal from "sweetalert2";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL


const UserModal = ({ show, handleClose }) => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [language, setLanguage] = useState("");  // New state for language

  const createUser = async (e) => {
    e.preventDefault();
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        lastName,
        email,
        password,
        role,
        language,  // Include the language in the body
      }),
    });
    const data = await response.json();
    try {
      if (data.error) {
        Swal.fire({
          title: "Error!",
          text: data.error,
          icon: "error",
          confirmButtonText: "Ok",
        });
      } else {
        Swal.fire({
          title: "Success!",
          text: "User created successfully.",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
    }

    setName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setRole("user");
    setLanguage("");
    handleClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-brand-dark-secondary p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all border border-gray-200 dark:border-purple-500/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Create New User</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-2xl">&times;</button>
        </div>
        <form onSubmit={createUser} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-white dark:bg-brand-dark border border-gray-300 dark:border-purple-500/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-800 dark:text-white"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 bg-white dark:bg-brand-dark border border-gray-300 dark:border-purple-500/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-800 dark:text-white"
            />
          </div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-white dark:bg-brand-dark border border-gray-300 dark:border-purple-500/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-800 dark:text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-white dark:bg-brand-dark border border-gray-300 dark:border-purple-500/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-800 dark:text-white"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 bg-white dark:bg-brand-dark border border-gray-300 dark:border-purple-500/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-800 dark:text-white"
          >
            <option value="user">User</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-3 bg-white dark:bg-brand-dark border border-gray-300 dark:border-purple-500/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-800 dark:text-white"
          >
            <option value="">Select Language</option>
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="polish">Polish</option>
          </select>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="py-2.5 px-6 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-600 shadow-md transition"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
