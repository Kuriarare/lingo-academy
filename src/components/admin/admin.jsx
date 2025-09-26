import { useEffect, useState } from "react";
import Dashboard from "../../sections/dashboard";
import Navbar from "../navbar";
import UserModal from "./userModal";
import DeleteUserModal from "./deleteUserModal";
import { useSelector } from "react-redux";
import StudentAssignment from "./studentAssignment"; // Import the new component
import RemoveStudent from "./RemoveStudent";
import DisplayAllStudents from "./DisplayAllStudents";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const Admin = () => {
  const user = useSelector((state) => state.user.userInfo.user);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [users, setUsers] = useState([]);

  const toggleUserModal = () => setShowUserModal(!showUserModal);
  const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

  useEffect(() => {
    // fetch(`${BACKEND_URL}/allusers`)
    fetch(`${BACKEND_URL}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const teachers = users.filter((user) => user.role === "teacher");
  const students = users.filter(
    (user) => user.role === "user" && (user.teacher === null)
    // (user) => user.role === "user" && user.teacher === undefined
  );
  const allStudents = users.filter((user) => user.role === "user");

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
        <RemoveStudent teachers={teachers} students={students} />
        <DisplayAllStudents students={allStudents} />

      </div>

      <UserModal show={showUserModal} handleClose={toggleUserModal} />
      <DeleteUserModal show={showDeleteModal} handleClose={toggleDeleteModal} />
    </div>
  );
};

export default Admin;
