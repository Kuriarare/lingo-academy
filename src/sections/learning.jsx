// import CoursesCard from "../components/coursesCard";
import Dashboard from "./dashboard";
import Navbar from "../components/navbar";
// import courses from "../constants";

const Learning = () => {

  const header = "LEARNING PAGE";
  return (
    <div className="flex w-full relative h-[90vh]">
      <Dashboard />
      <div className="w-full">
      <section className="w-full custom-bg">
        <div className="container">
          <Navbar header={header} />
         
        </div>
      </section>
      {/* <section className="flex justify-center items-center gap-20 mt-4">
        {courses.map((course) => (  
          <CoursesCard key={course.id} {...course} />
        ))}
      </section> */}
       <div className='flex justify-center items-center h-[90vh]'>
        <span className='text-5xl text-center'>
        Soon all your courses here...
        </span>
    </div>
      </div>     
    </div>
  );
}

export default Learning