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
    <div className="flex w-full min-h-screen bg-gray-100 dark:bg-brand-dark">
      <Dashboard />
      <div className="w-full h-screen overflow-y-auto">
        <section className="w-full bg-brand-navbar-light dark:bg-brand-dark-secondary shadow-md border-b border-transparent dark:border-purple-500/20">
          <div className="container">
            <Navbar header="Admin Panel" />
            <div className="flex flex-col md:flex-row justify-between md:items-center text-white py-8">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Hello {user.name}, welcome to the Admin Interface
                </h2>
                <p className="max-w-md mt-2 text-white/80">
                  From here you can manage users, assign students, and oversee platform activities.
                </p>
              </div>
              <div className="flex gap-4 mt-4 md:mt-0">
                <button
                  type="button"
                  onClick={toggleUserModal}
                  className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={toggleDeleteModal}
                  className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </section>

        <main className="p-4 md:p-8">
          <div className="space-y-8">
            <div className="bg-white dark:bg-brand-dark-secondary p-6 rounded-lg shadow-md border border-gray-200 dark:border-purple-500/20">
              <StudentAssignment teachers={teachers} students={students} />
            </div>
            <div className="bg-white dark:bg-brand-dark-secondary p-6 rounded-lg shadow-md border border-gray-200 dark:border-purple-500/20">
              <RemoveStudent teachers={teachers} students={students} />
            </div>
            <div className="bg-white dark:bg-brand-dark-secondary p-6 rounded-lg shadow-md border border-gray-200 dark:border-purple-500/20">
              <DisplayAllStudents students={allStudents} />
            </div>
          </div>
        </main>
      </div>

      <UserModal show={showUserModal} handleClose={toggleUserModal} />
      <DeleteUserModal show={showDeleteModal} handleClose={toggleDeleteModal} />
    </div>
  );
};

export default Admin;
