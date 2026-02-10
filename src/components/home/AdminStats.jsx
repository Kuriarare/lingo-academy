import { FiCalendar, FiUsers, FiBook, FiUserCheck } from "react-icons/fi";

const AdminStats = ({ 
  teachersCount = 0, 
  studentsCount = 0, 
  unassignedStudentsCount = 0,
  totalUsers = 0 
}) => {
  // Calculate percentages
  const teacherPercentage = totalUsers > 0 ? Math.round((teachersCount / totalUsers) * 100) : 0;
  const studentPercentage = totalUsers > 0 ? Math.round((studentsCount / totalUsers) * 100) : 0;
  
  const adminStats = [
    { 
      label: "Total Users", 
      value: totalUsers.toString(), 
      icon: <FiUsers />, 
      change: `${totalUsers} total`,
      description: "All platform users"
    },
    { 
      label: "Teachers", 
      value: teachersCount.toString(), 
      icon: <FiUserCheck />, 
      change: `${teacherPercentage}% of total`,
      description: "Active teachers"
    },
    { 
      label: "Students", 
      value: studentsCount.toString(), 
      icon: <FiUsers />, 
      change: `${studentPercentage}% of total`,
      description: "All students"
    },
    { 
      label: "Unassigned Students", 
      value: unassignedStudentsCount.toString(), 
      icon: <FiBook />, 
      change: studentsCount > 0 ? `${Math.round((unassignedStudentsCount / studentsCount) * 100)}% of students` : "0%",
      description: "Students without teacher"
    }
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {adminStats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              {stat.icon}
            </div>
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
              {stat.change}
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</h3>
          <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">{stat.label}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500">{stat.description}</p>
        </div>
      ))}
    </section>
  );
};

export default AdminStats;