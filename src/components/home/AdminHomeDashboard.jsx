import { useState, useEffect } from "react";
import { FiGlobe } from "react-icons/fi";
import { useSelector } from "react-redux";
import AdminStats from "./AdminStats";
import LanguageFilter from "./LanguageFilter";
import ClassCard from "./ClassCard";
import QuickActions from "./QuickActions";

const AdminHomeDashboard = () => {
  const [activeSection, setActiveSection] = useState("all");
  const [users, setUsers] = useState([]);
  const [todaysClasses, setTodaysClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Backend URL - adjust as needed
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001/api";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users
        const usersResponse = await fetch(`${BACKEND_URL}/users`);
        if (!usersResponse.ok) {
          throw new Error(`HTTP error! status: ${usersResponse.status}`);
        }
        const usersData = await usersResponse.json();
        console.log("Fetched users:", usersData); // Debug log
        setUsers(usersData);

        // TODO: Fetch actual classes from schedules table
        // For now, generate mock classes using actual users
        generateMockClasses(usersData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate mock classes using actual users
  const generateMockClasses = (usersData) => {
    const teachers = usersData.filter(user => user.role === "teacher");
    const students = usersData.filter(user => user.role === "user");
    
    if (teachers.length === 0 || students.length === 0) {
      setTodaysClasses([]);
      return;
    }

    const mockClasses = {
      english: [],
      spanish: [],
      polish: []
    };

    // Create some sample classes
    const times = ["9:00 AM - 10:00 AM", "11:00 AM - 12:00 PM", "2:00 PM - 3:00 PM", "4:30 PM - 5:30 PM"];
    const languages = ["English", "Spanish", "Polish"];
    
    let classId = 1;
    
    // For each language, create 1-2 classes
    languages.forEach((language, langIndex) => {
      // Pick a teacher for this language (cycle through available teachers)
      const teacherIndex = langIndex % teachers.length;
      const teacher = teachers[teacherIndex];
      
      // Pick a student for this language (cycle through available students)
      const studentIndex = langIndex % students.length;
      const student = students[studentIndex];
      
      const timeIndex = langIndex % times.length;
      
      const classItem = {
        id: classId++,
        teacherName: `${teacher.name} ${teacher.lastName}`,
        teacherAvatar: teacher.avatarUrl || `https://ui-avatars.com/api/?name=${teacher.name}+${teacher.lastName}&background=random`,
        studentName: `${student.name} ${student.lastName}`,
        studentAvatar: student.avatarUrl || `https://ui-avatars.com/api/?name=${student.name}+${student.lastName}&background=random`,
        time: times[timeIndex],
        language: language
      };
      
      // Add to appropriate language array
      if (language === "English") {
        mockClasses.english.push(classItem);
      } else if (language === "Spanish") {
        mockClasses.spanish.push(classItem);
      } else if (language === "Polish") {
        mockClasses.polish.push(classItem);
      }
    });
    
    setTodaysClasses(mockClasses);
  };

  // Filter users by role using your entity structure
  const teachers = users.filter((user) => user.role === "teacher");
  const unassignedStudents = users.filter((user) => user.role === "user" && !user.teacher);
  const allStudents = users.filter((user) => user.role === "user");

  const handleJoinClass = (classId) => {
    alert(`Joining class ${classId} as admin observer`);
  };

  const handleViewChat = (chatId) => {
    alert(`Opening chat: chat_${chatId}`);
  };

  const filteredClasses = activeSection === "all" 
    ? [...(todaysClasses.english || []), ...(todaysClasses.spanish || []), ...(todaysClasses.polish || [])]
    : todaysClasses[activeSection] || [];

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-brand-purple mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
          Admin Dashboard
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Monitor and manage all language classes in real-time
        </p>
      </section>

      {/* Stats with real user data */}
      <AdminStats 
        teachersCount={teachers.length}
        studentsCount={allStudents.length}
        unassignedStudentsCount={unassignedStudents.length}
        totalUsers={users.length}
      />

      {/* Language Navigation & Classes */}
      <section className="mb-10">
        <div className="flex items-center mb-8">
          <FiGlobe className="text-4xl text-purple-600 dark:text-brand-purple mr-4" />
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white">Today's Classes</h2>
          <span className="ml-4 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold">
            {filteredClasses.length} classes
          </span>
        </div>
        
        <LanguageFilter 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        {/* User Info Debug (remove in production) */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Data Summary:</span> {teachers.length} teachers, {allStudents.length} students ({unassignedStudents.length} unassigned)
          </div>
        </div>

        {/* Class Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredClasses.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classItem={classItem}
              onJoinClass={handleJoinClass}
              onViewChat={handleViewChat}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredClasses.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">No classes scheduled</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {teachers.length === 0 ? "No teachers found" : 
               allStudents.length === 0 ? "No students found" : 
               "There are no classes scheduled for today"}
            </p>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <QuickActions />
    </main>
  );
};

export default AdminHomeDashboard;