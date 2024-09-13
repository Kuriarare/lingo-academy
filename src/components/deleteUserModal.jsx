import { useState } from "react";

const DeleteUserModal = ({ show, handleClose }) => {
  const [email, setEmail] = useState('');

  const handleDeleteUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/deleteuser", {
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl mb-4">Delete User</h2>
        <form onSubmit={handleDeleteUser}>
          <input
            type="text"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-2 p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Delete User
          </button>
        </form>
        <button
          type="button"
          onClick={handleClose}
          className="mt-4 w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteUserModal;
