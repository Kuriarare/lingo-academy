import { useState } from "react";
import Dashboard from "./dashboard";
import Navbar from "../components/navbar";
import CoursesCard from "../components/coursesCard";
import { FiInfo, FiBookOpen, FiVideo } from "react-icons/fi";

const Learning = () => {
  const header = "LEARNING PAGE";
  const [showBanner, setShowBanner] = useState(true);

  const languageCourses = {
    title: "Interactive Language Courses",
    courses: [
      {
        id: 1,
        title: "Spanish for Beginners",
        description: "Master the fundamentals of Spanish with interactive lessons, quizzes, and real-life conversation practice.",
        image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1966&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        button: "Start Learning",
        level: "Beginner",
        duration: "8 Weeks"
      },
      {
        id: 2,
        title: "Advanced English",
        description: "Elevate your English proficiency by exploring complex grammar, literature, and cultural nuances.",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        button: "Continue Learning",
        level: "Advanced",
        duration: "12 Weeks"
      },
      {
        id: 3,
        title: "Conversational Italian",
        description: "Build confidence in your Italian speaking skills through immersive role-playing and guided conversations.",
        image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        button: "Start Speaking",
        level: "Intermediate",
        duration: "6 Weeks"
      }
    ]
  };

  const ebooks = {
    title: "Cultural & Language E-books",
    courses: [
      {
        id: 1,
        title: "The Art of Italian Cooking",
        description: "A culinary journey through Italy that will enrich your vocabulary and tantalize your taste buds.",
        image: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        button: "Read Now",
        level: "All Levels",
        duration: "Self-paced"
      },
      {
        id: 2,
        title: "Japanese Folklore and Mythology",
        description: "Delve into the enchanting world of Japanese myths and legends while expanding your language skills.",
        image: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        button: "Discover More",
        level: "Advanced",
        duration: "Self-paced"
      },
      {
        id: 3,
        title: "A Guide to Business English",
        description: "Equip yourself with the essential language and etiquette for success in the global marketplace.",
        image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        button: "Enhance Your Career",
        level: "Intermediate",
        duration: "Self-paced"
      }
    ]
  };

  return (
    <div className="flex w-full relative bg-gray-100 dark:bg-brand-dark">
      <Dashboard />
      <div className="w-full">
        <section className="w-full bg-brand-navbar-light dark:bg-brand-dark-secondary shadow-md border-b border-transparent dark:border-purple-500/20">
          <div className="container">
            <Navbar header={header} />
          </div>
        </section>
        <div className="p-8">
          {showBanner && (
            <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4 rounded-lg mb-8 flex justify-between items-center shadow-md">
              <div className="flex items-center">
                <FiInfo className="text-2xl mr-3" />
                <p className="font-semibold">This page is for demonstration purposes only. All course materials and images are placeholders.</p>
              </div>
              <button onClick={() => setShowBanner(false)} className="text-xl font-bold">&times;</button>
            </div>
          )}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white">Unlock Your Potential</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
              Dive into our world of languages and cultures.
            </p>
          </div>

          <div className="mb-16">
            <div className="flex items-center mb-8">
              <FiVideo className="text-4xl text-purple-600 dark:text-brand-purple mr-4" />
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white">{languageCourses.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {languageCourses.courses.map((course) => (
                <CoursesCard key={course.id} {...course} />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center mb-8">
              <FiBookOpen className="text-4xl text-purple-600 dark:text-brand-purple mr-4" />
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white">{ebooks.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {ebooks.courses.map((course) => (
                <CoursesCard key={course.id} {...course} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;