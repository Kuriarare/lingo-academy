import PropTypes from 'prop-types';
import { CalendarIcon, UserIcon } from '@heroicons/react/20/solid';

export const UpcomingClass = ({ time, teacher, date, onJoin }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-150 hover:border-[#11CDE7]/30 transition-colors">
    <div className="flex justify-between items-center mb-2">
      <span className="font-medium text-[#11CDE7] text-base">{time}</span>
      <div className="flex items-center text-gray-400 text-sm">
        <CalendarIcon className="w-4 h-4 mr-1.5" />
        {date}
      </div>
    </div>
    
    <div className="flex items-center mb-3">
      <div className="mr-2 p-1.5 bg-[#11CDE7]/10 rounded-full">
        <UserIcon className="w-4 h-4 text-[#11CDE7]" />
      </div>
      <span className="text-gray-600 text-sm">{teacher}</span>
    </div>
    
    <button
      onClick={onJoin}
      className="w-full inline-flex justify-center items-center px-4 py-2 bg-[#11CDE7] text-white rounded-md hover:bg-[#0eb4c7] transition-colors text-sm font-medium"
    >
      Join now →
    </button>
  </div>
);

UpcomingClass.propTypes = {
  time: PropTypes.string.isRequired,
  teacher: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  // onJoin: PropTypes.func.isRequired,
};





// export const UpcomingClass = ({ time, teacher, date, joinLink }) => (
//   <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:border-[#11CDE7] transition-all group">
//     <div className="flex justify-between items-start mb-3">
//       <h3 className="text-lg font-semibold text-gray-900">{time}</h3>
//       <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm">
//         <CalendarIcon className="w-4 h-4 mr-2" />
//         {date}
//       </span>
//     </div>
    
//     <div className="flex items-center text-gray-600 mb-4">
//       <UserCircleIcon className="w-5 h-5 mr-2" />
//       <span className="font-medium">With {teacher}</span>
//     </div>
    
//     <a
//       href={joinLink}
//       className="w-full inline-flex justify-center items-center px-4 py-2 bg-[#11CDE7] text-white rounded-md hover:bg-[#0eb4c7] transition-colors text-sm font-medium"
//     >
//       
//     </a>
//   </div>
// );

