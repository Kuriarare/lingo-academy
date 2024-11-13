import { useSelector } from "react-redux";
import Dashboard from "./dashboard";
import Navbar from "../components/navbar";
import { DashboardCard } from "../components/home/DashboardCard";
import { FiBook, FiClock, FiAward, FiCalendar } from "react-icons/fi";
import { InfoCard } from "../components/home/InfoCard";
import { UpcomingClass } from "../components/home/UpcomingClass";
import useFormattedEvents from "../hooks/useFormattedEvents";

const Home = () => {
  const user = useSelector((state) => state.user.userInfo.user);
  useFormattedEvents(user);
  const home = "HOME PAGE";

  return (
    <div className="flex w-full h-[97vh] ">
      {/* Dashboard on the left */}
      <Dashboard />

      {/* Home component on the right */}
      <div className="w-full h-full overflow-y-auto">
        <section className="w-full custom-bg">
          <div className="container">
            <Navbar header={home} />
          </div>
        </section>

        {/* Content of the Home component */}
        <div className="min-h-[92vh] ">
          <div className="px-8 pt-8 pb-4">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-600 mb-2">
                Hello {user.name}, welcome to Lingolandias Academy
              </h1>
              <p className="text-gray-600">
                Please visit the &quot;My Schedule&quot; section on the sidebar to join your upcoming classes.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <DashboardCard
                title="Total Classes"
                value="0"
                icon={<FiBook />}
                gradient="bg-gradient-to-r from-[#11CDE7] to-[#1171EF]"
              />
              <DashboardCard
                title="Study Hours"
                value="0"
                icon={<FiClock />}
                gradient="bg-gradient-to-r from-[#172B4D] to-[#1A174D]"
              />
              <DashboardCard
                title="Activities"
                value="0"
                icon={<FiAward />}
                gradient="bg-gradient-to-r from-[#11CDE7] to-[#1171EF]"
              />
              {/* <DashboardCard
                title="Streak Days"
                value="0"
                icon={<FiCalendar />}
                gradient="bg-gradient-to-r from-[#172B4D] to-[#1A174D]"
              /> */}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Academy Info */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-600 mb-6">About Our Academy</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard
                    question="How long will it take?"
                    answer="Learning a foreign language is a process, so we will set your goals together and choose an individual teaching path so that you can start communicating in English as soon as possible."
                    gradient="bg-gradient-to-r from-[#11CDE7] to-[#1171EF]"
                  />
                  <InfoCard
                    question="Why do I lack freedom in speaking?"
                    answer="The lack of freedom in speaking English has various causes, however, our task and goal is to detect your individual causes of this condition and its guaranteed elimination."
                    gradient="bg-gradient-to-r from-[#172B4D] to-[#1A174D]"
                  />
                  <InfoCard
                    question="Will we learn grammar?"
                    answer="Yes and no. Yes: because grammar is important and crucial for proper communication. No: thanks to our methods you will learn grammar without even knowing it, so it is as if you were not learning it."
                    gradient="bg-gradient-to-r from-[#172B4D] to-[#1A174D]"
                  />
                  <InfoCard
                    question="What if we can't attend the scheduled classes?"
                    answer="Don't worry about anything! The window for rescheduling classes is 24 hours before the scheduled meeting, and thanks to the human approach of our teachers, in exceptional cases, with the right attitude, you will be able to do something even after 24 hours."
                    gradient="bg-gradient-to-r from-[#11CDE7] to-[#1171EF]"
                  />
                </div>
              </div>

              {/* Upcoming Classes */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-600 mb-6">Upcoming Classes</h2>
                <UpcomingClass
                  time="2:00 PM"
                  teacher="Sarah Johnson"
                  topic="Business English"
                  level="Advanced"
                />
                <UpcomingClass
                  time="4:30 PM"
                  teacher="Michael Smith"
                  topic="Pronunciation"
                  level="Intermediate"
                />
                <UpcomingClass
                  time="6:00 PM"
                  teacher="Emma Davis"
                  topic="Grammar Focus"
                  level="Advanced"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
