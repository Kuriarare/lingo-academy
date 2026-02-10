import { useSelector } from "react-redux";
import Dashboard from "./dashboard";
import Navbar from "../components/navbar";
import UserHomePage from "../components/home/UserHomePage";
import AdminHomeDashboard from "../components/home/AdminHomeDashboard";

const Home = () => {
  const user = useSelector((state) => state.user.userInfo.user);

  return (
    <div className="flex w-full min-h-screen bg-gray-100 dark:bg-brand-dark">
      <Dashboard />

      <div className="w-full">
        <section className="w-full bg-brand-navbar-light dark:bg-brand-dark-secondary shadow-md border-b border-transparent dark:border-purple-500/20">
          <div className="container mx-auto px-4">
            <Navbar header="HOME PAGE" />
          </div>
        </section>
        
        {/* Contenido principal */}
        {user.role === "admin" ? (
          <AdminHomeDashboard />
        ) : (
          <UserHomePage />
        )}
      </div>
    </div>
  );
};

export default Home;

// REMOVE THIS ENTIRE SECTION - It's a duplicate!
// const AdmingHomeDashboard = () => {
//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
//             <p>Welcome to the admin dashboard! Here you can manage your platform.</p>
//         </div>
//     );
// }

// export default AdmingHomeDashboard;