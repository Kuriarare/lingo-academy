import { useState } from "react";

const UserModal = ({ show, handleClose }) => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [language, setLanguage] = useState("");  // New state for language

  const createUser = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/auth/register", {
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
        alert(data.error);
      } else {
        alert("User created successfully");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl mb-4">Create User</h2>
        <form onSubmit={createUser}>
          <input
            type="text"
            id="name"
            placeholder="First Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            id="lastName"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          >
            <option value="user">User</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>

          {/* New Language Select */}
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          >
            <option value="">Select Language</option>
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="polish">Polish</option>
          </select>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="py-2 px-4 bg-gray-500 text-white rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
