import PropTypes from 'prop-types';
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';

export const UpcomingClass = ({ time, teacher, date, onJoin }) => (
  <div className="bg-gray-50 dark:bg-brand-dark-secondary p-4 rounded-lg border border-gray-200 dark:border-purple-500/20 flex items-center justify-between transform hover:shadow-md hover:border-purple-300 dark:hover:border-brand-orange transition-all duration-300">
    <div className="flex items-center">
      <div className="flex flex-col items-center justify-center w-16">
        <p className="text-xl font-bold text-purple-600 dark:text-brand-orange">{time.split(' ')[0]}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{time.split(' ')[1]}</p>
      </div>
      <div className="ml-4">
        <p className="text-base font-semibold text-gray-800 dark:text-white flex items-center">
          <FiUser className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
          {teacher}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
          <FiCalendar className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
          {date}
        </p>
      </div>
    </div>
    <button
      onClick={onJoin}
      className="px-4 py-2 bg-[#8E44AD] dark:bg-brand-purple text-white rounded-lg hover:bg-[#7B3A9A] dark:hover:bg-brand-orange transition-colors duration-300 text-sm font-semibold flex items-center"
    >
      Join <FiArrowRight className="w-4 h-4 ml-2" />
    </button>
  </div>
);

UpcomingClass.propTypes = {
  time: PropTypes.string.isRequired,
  teacher: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  onJoin: PropTypes.func.isRequired,
};
