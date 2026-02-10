import { FiVideo, FiMessageSquare } from "react-icons/fi";

const ClassCard = ({ classItem, onJoinClass, onViewChat }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
      
      {/* Class Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-semibold">
            {classItem.language}
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {classItem.time}
          </span>
        </div>
      </div>

      {/* Participants */}
      <div className="p-6">
        {/* Teacher */}
        <div className="flex items-center mb-6">
          <div className="relative">
            <img 
              src={classItem.teacherAvatar} 
              alt={classItem.teacherName}
              className="w-14 h-14 rounded-full border-3 border-white dark:border-gray-800 shadow"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
              <span className="text-xs text-white font-bold">T</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Teacher</p>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{classItem.teacherName}</h4>
          </div>
        </div>

        {/* Student */}
        <div className="flex items-center mb-8">
          <div className="relative">
            <img 
              src={classItem.studentAvatar} 
              alt={classItem.studentName}
              className="w-14 h-14 rounded-full border-3 border-white dark:border-gray-800 shadow"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
              <span className="text-xs text-white font-bold">S</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Student</p>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{classItem.studentName}</h4>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => onJoinClass(classItem.id)}
            className="flex-1 bg-purple-600 dark:bg-brand-purple hover:bg-purple-700 dark:hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center hover:shadow-lg"
          >
            <FiVideo className="mr-2" />
            Join Class
          </button>
          <button
            onClick={() => onViewChat(classItem.id)}
            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center hover:shadow-lg"
          >
            <FiMessageSquare className="mr-2" />
            View Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;