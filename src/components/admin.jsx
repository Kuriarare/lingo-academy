import { useState } from "react";
import Dashboard from "./dashboard";
import Navbar from "./navbar";
import UserModal from "./userModal";
import DeleteUserModal from "./deleteUserModal";

const Admin = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleUserModal = () => {
    setShowUserModal(!showUserModal);
  };

  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  return (
    <div className="flex w-full relative h-screen">
      <Dashboard />
      <section className="w-full h-[40vh] custom-bg">
        <div className="container">
          <Navbar />
          <div>
            <h1 className="text-white text-2xl mb-20">Hello Aga, this is your Admin interface</h1>
            <div>
              <button
                type="button"
                onClick={toggleUserModal}
                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Create User
              </button>
              <button
                type="button"
                onClick={toggleDeleteModal}
                className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      </section>
      <UserModal show={showUserModal} handleClose={toggleUserModal} />
      <DeleteUserModal show={showDeleteModal} handleClose={toggleDeleteModal} />
    </div>
  );
};

export default Admin;
