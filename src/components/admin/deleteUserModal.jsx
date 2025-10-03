import { useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const DeleteUserModal = ({ show, handleClose }) => {
  const [email, setEmail] = useState('');

  const handleDeleteUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BACKEND_URL}/users`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.error) {
        alert(data.error);
      } else {
        alert("User deleted successfully");
        window.location.reload();
      }
    } catch (error) {
      console.log("Error deleting user:", error);
    }

    setEmail('');
    handleClose(); // Close the modal after deletion
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Delete User</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleDeleteUser} className="space-y-4">
          <p className="text-gray-600">Enter the email address of the user you wish to delete. This action is irreversible.</p>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
          />
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="py-2.5 px-6 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 shadow-md transition"
            >
              Delete User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteUserModal;
