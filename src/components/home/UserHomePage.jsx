import { DashboardCard } from "../../components/home/DashboardCard";
import { FiBook, FiClock, FiAward } from "react-icons/fi";
import { InfoCard } from "../../components/home/InfoCard";
import { UpcomingClass } from "../../components/home/UpcomingClass";
import { getNextClasses } from "../../data/helpers";
import { useNavigate } from "react-router-dom";
import { handleJoinClass } from "../../data/joinClassHandler";
import { useSelector } from "react-redux";

const UserHomePage = () => {
  const user = useSelector((state) => state.user.userInfo.user);
  const nextClasses = getNextClasses(user);
  const navigate = useNavigate();

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <section className="text-center mb-16 animate-fade-in-down">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
          Welcome, {user.name}!
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Your journey to fluency starts here. Let's make today productive.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in-up">
        <DashboardCard
          title="Total Classes"
          value="0"
          icon={<FiBook />}
          color={["#9E2FD0", "#F3E5F5"]}
        />
        <DashboardCard
          title="Study Hours"
          value="0"
          icon={<FiClock />}
          color={["#26D9A1", "#E0F2F1"]}
        />
        <DashboardCard
          title="Activities"
          value="0"
          icon={<FiAward />}
          color={["#F6B82E", "#FFF8E1"]}
        />
      </section>

      <div className="grid lg:grid-cols-3 gap-12">
        <section className="lg:col-span-2 animate-fade-in">
          <div className="flex items-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white">Frequently Asked Questions</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <InfoCard
              question="How long will it take?"
              answer="Our tailored approach ensures you start communicating effectively as soon as possible by setting achievable goals together."
            />
            <InfoCard
              question="Why do I lack freedom in speaking?"
              answer="We identify and address the root causes of hesitation, guaranteeing a significant boost in your speaking confidence."
            />
            <InfoCard
              question="Will we learn grammar?"
              answer="Absolutely. Our innovative methods integrate grammar seamlessly, so you'll learn the rules without tedious drills."
            />
            <InfoCard
              question="What if we can't attend classes?"
              answer="Flexibility is key. You can reschedule up to 24 hours before your class, and we're always understanding in emergencies."
            />
          </div>
        </section>

        <section className="animate-fade-in">
          <div className="flex items-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white">Next Sessions</h2>
          </div>
          <div className="space-y-4">
            {nextClasses.map((classSession) => {
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
                      ? classSession.studentName
                      : classSession.teacherName
                  }
                  date={displayDate.format("MMM D")}
                  onJoin={() =>
                    handleJoinClass({ user, classSession, navigate })
                  }
                />
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
};

export default UserHomePage;