import { useEffect, useState } from "react";
import Dashboard from "../sections/dashboard";
import Navbar from "./navbar";
import UserModal from "./userModal";
import DeleteUserModal from "./deleteUserModal";
import { useSelector } from "react-redux";
import StudentAssignment from "./studentAssignment"; // Import the new component
const LOCAL_HOST = 'http://localhost:8000'
// https://lingo.srv570363.hstgr.cloud/
// http://localhost:8000
const Admin = () => {
  const user = useSelector((state) => state.user.userInfo.user);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [users, setUsers] = useState([]);

  const toggleUserModal = () => setShowUserModal(!showUserModal);
  const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

  useEffect(() => {
    // fetch(`${LOCAL_HOST}/allusers`)
    fetch(`${LOCAL_HOST}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const teachers = users.filter((user) => user.role === "teacher");
  const students = users.filter(
    (user) => user.role === "user" && (user.studentSchedules.length === 0)
    // (user) => user.role === "user" && user.teacher === undefined
  );

  return (
    <div className="flex w-full relative h-screen">
      <Dashboard />
      <div className="w-full">
        <section className="w-full h-[25vh] custom-bg">
          <div className="container">
            <Navbar />
            <div>
              <h1 className="text-white text-2xl mb-10">
                Hello {user.name}, this is your Admin interface
              </h1>
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

        <StudentAssignment teachers={teachers} students={students} />

      </div>

      <UserModal show={showUserModal} handleClose={toggleUserModal} />
      <DeleteUserModal show={showDeleteModal} handleClose={toggleDeleteModal} />
    </div>
  );
};

export default Admin;
