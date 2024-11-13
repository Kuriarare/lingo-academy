import PropTypes from 'prop-types';

export const UpcomingClass = ({ time, teacher, topic, level }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-[#11CDE7] hover:transform hover:scale-102 transition-all">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-semibold text-gray-600">{topic}</h4>
          <p className="text-sm text-gray-600">Teacher: {teacher}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {level}
          </span>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-[#273296]">{time}</p>
        </div>
      </div>
    </div>
  );
};

UpcomingClass.propTypes = {
  time: PropTypes.string.isRequired,
  teacher: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
};

