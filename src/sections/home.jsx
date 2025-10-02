import { useSelector } from "react-redux";
import Dashboard from "./dashboard";
import Navbar from "../components/navbar";
import { DashboardCard } from "../components/home/DashboardCard";
import { FiBook, FiClock, FiAward } from "react-icons/fi";
import { InfoCard } from "../components/home/InfoCard";
import { UpcomingClass } from "../components/home/UpcomingClass";
import { useEffect, useState } from "react";
import { getNextClasses } from "../data/helpers";
import { useNavigate } from "react-router-dom";
import { handleJoinClass } from "../data/joinClassHandler";

const Home = () => {
  const user = useSelector((state) => state.user.userInfo.user);
  const nextClasses = getNextClasses(user);
  const navigate = useNavigate();

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Dashboard />

      <div className="w-full">
        {/* Header Section */}
        <section className="w-full custom-bg">
          <div className="container">
            <Navbar header="HOME PAGE" />
          </div>
        </section>

        {/* Main Content Container */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <section className="mb-12 animate-fade-in">
            <h1 className="text-3xl font-bold text-[#2D2D2D] mb-2">
              Welcome, {user.name}
              <span className="text-[#9E2FD0] ml-2">👋</span>
            </h1>
            <p className="text-lg text-gray-600">
              Ready for your next lesson? Visit the{" "}
              <span className="text-[#9E2FD0] font-medium">My Schedule</span>{" "}
              section to join classes.
            </p>
          </section>

          {/* Stats Dashboard */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in">
            <DashboardCard
              title="Total Classes"
              value="0"
              icon={<FiBook className="w-6 h-6" />}
              gradient="bg-[#9E2FD0] hover:bg-[#8B26B8]"
            />
            <DashboardCard
              title="Study Hours"
              value="0"
              icon={<FiClock className="w-6 h-6" />}
              gradient="bg-[#26D9A1] hover:bg-[#20B98B]"
            />
            <DashboardCard
              title="Activities"
              value="0"
              icon={<FiAward className="w-6 h-6" />}
              gradient="bg-[#F6B82E] hover:bg-[#D89D20]"
            />
          </section>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Academy FAQ Section */}
            <section className="lg:col-span-2 animate-fade-in">
              <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-6 pb-2 border-b border-gray-200">
                Academy FAQs
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <InfoCard
                  question="How long will it take?"
                  answer="Learning a foreign language is a process, so we will set your goals together and choose an individual teaching path so that you can start communicating in English as soon as possible."
                  gradient="bg-white border-l-4 border-[#9E2FD0] shadow-sm hover:shadow-md"
                />
                <InfoCard
                  question="Why do I lack freedom in speaking?"
                  answer="The lack of freedom in speaking English has various causes, however, our task and goal is to detect your individual causes of this condition and its guaranteed elimination."
                  gradient="bg-white border-l-4 border-[#26D9A1] shadow-sm hover:shadow-md"
                />
                <InfoCard
                  question="Will we learn grammar?"
                  answer="Yes and no. Yes: because grammar is important and crucial for proper communication. No: thanks to our methods you will learn grammar without even knowing it, so it is as if you were not learning it."
                  gradient="bg-white border-l-4 border-[#F6B82E] shadow-sm hover:shadow-md"
                />
                <InfoCard
                  question="What if we can't attend classes?"
                  answer="Don't worry about anything! The window for rescheduling classes is 24 hours before the scheduled meeting, and thanks to the human approach of our teachers, in exceptional cases, with the right attitude, you will be able to do something even after 24 hours."
                  gradient="bg-white border-l-4 border-[#13AD97] shadow-sm hover:shadow-md"
                />
              </div>
            </section>

            {/* Schedule Section */}
            <section className="bg-white rounded-xl shadow-sm p-5 h-fit sticky top-6 border border-gray-100 animate-fade-in">
              <h2 className="text-lg font-medium text-gray-500 mb-4 tracking-wide">
                NEXT SESSIONS
              </h2>
              {nextClasses.map((classSession) => {
          // For teachers, we use classSession.nextOccurrence;
          // For students, we use classSession.occurrence.
          const displayDate =
            user.role === "teacher"
              ? classSession.nextOccurrence
              : classSession.occurrence;
          
          return (
            <UpcomingClass
              key={`${classSession.id}-${displayDate.format()}`}
              time={displayDate.format("h:mm A")}
              teacher={
                user.role === "teacher"
                  ? classSession.studentName   // teacher sees the student's name
                  : classSession.teacherName   // student sees the teacher's name
              }
              date={displayDate.format("MMM D")}
              // Instead of a joinLink prop, we pass an onJoin callback:
              onJoin={() =>
                handleJoinClass({ user, classSession, navigate })
              }
            />
          );
        })}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;

