import { useSelector } from "react-redux";
import Dashboard from "./dashboard";
import Navbar from "../components/navbar";


const Home = () => {
  const user = useSelector((state) => state.user.userInfo.user) ;
  const home = 'HOME PAGE';
  console.log('Home component rendered');



  return (
    <div className="flex w-full h-screen">
      <Dashboard />
      <div className="w-full">
      <section className="w-full custom-bg">
        <div className="container">
          <Navbar header={home} />
          
        </div>
      </section>
      <section className="container">
      <h1 className="text-xl text-black">
            Hello {user.name}, welcome to Lingolandias Academy. Please visit the &quot;My Schedule&quot; section on the sidebar to check your upcoming classes.
          
          </h1>
      </section>
      </div>
    </div>
  );
};

export default Home;
