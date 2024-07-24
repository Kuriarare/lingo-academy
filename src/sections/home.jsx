import { useEffect, useState } from "react";
import Dashboard from "../components/dashboard";
import Navbar from "../components/navbar";

const Home = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("https://lingo-platform.onrender.com/userdata", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
      })
      .catch((error) => console.error("Error:", error));
  }, []);
  return (
    <div className="flex w-full h-[100vh]">
      <Dashboard />
      <section className="w-full h-[40vh] custom-bg ">
        <div className="container">
          <Navbar />
          <h1 className="text-xl text-white ">Hello {name}, welcome</h1>
        </div>
      </section>
    </div>
  );
};

export default Home;
