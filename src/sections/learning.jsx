import CoursesCard from "../components/coursesCard";
import Dashboard from "./dashboard";
import Navbar from "../components/navbar";
import courses from "../constants";

const Learning = () => {

  const header = "LEARNING PAGE";
  return (
    <div className="flex w-full relative h-screen">
      <Dashboard />
      <div className="w-full">
      <section className="w-full h-[15vh] custom-bg">
        <div className="container">
          <Navbar header={header} />
          <div>
            <h1 className="text-white text-2xl mb-20">Here you can find all the courses we offer</h1>
            <div>
             
            </div>
          </div>
        </div>
      </section>
      <section className="flex justify-center items-center gap-20 mt-4">
        {courses.map((course) => (  
          <CoursesCard key={course.id} {...course} />
        ))}
      </section>
      </div>     
    </div>
  );
}

export default Learning