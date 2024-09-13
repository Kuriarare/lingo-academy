import { useSelector } from "react-redux";
import Dashboard from "./dashboard";
import Navbar from "../components/navbar";

const Home = () => {
  const user = useSelector((state) => state.user.userInfo.user);
  const home = 'HOME PAGE'

  return (
    <div className="flex w-full h-[100vh]">
      <Dashboard />
      <section className="w-full h-[40vh] custom-bg ">
        <div className="container">
          <Navbar header={home} />
          <h1 className="text-xl text-white ">Hello {user?.name}, welcome</h1>
        </div>
      </section>
    </div>
  );
};

export default Home;