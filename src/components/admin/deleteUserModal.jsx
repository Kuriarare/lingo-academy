import { useState } from "react";
import Swal from "sweetalert2";
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
        Swal.fire({
          title: "Error!",
          text: data.error,
          icon: "error",
          confirmButtonText: "Ok",
        });
      } else {
        Swal.fire({
          title: "Deleted!",
          text: "User deleted successfully.",
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
    }

    setEmail('');
    handleClose(); // Close the modal after deletion
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-brand-dark-secondary p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all border border-gray-200 dark:border-purple-500/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Delete User</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-2xl">&times;</button>
        </div>
        <form onSubmit={handleDeleteUser} className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">Enter the email address of the user you wish to delete. This action is irreversible.</p>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-white dark:bg-brand-dark border border-gray-300 dark:border-purple-500/20 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-gray-800 dark:text-white"
          />
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
