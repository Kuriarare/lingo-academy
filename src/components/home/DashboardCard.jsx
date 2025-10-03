import PropTypes from 'prop-types';

export const DashboardCard = ({ title, value, icon, color }) => (
  <div className="bg-white dark:bg-brand-dark-secondary p-6 rounded-xl shadow-lg flex items-center space-x-6 transform hover:-translate-y-2 transition-transform duration-300 ease-in-out">
    <div className={`p-4 rounded-full bg-opacity-20`} style={{ backgroundColor: color[1] }}>
      <div className="text-3xl" style={{ color: color[0] }}>{icon}</div>
    </div>
    <div>
      <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
    </div>
  </div>
);

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  color: PropTypes.arrayOf(PropTypes.string).isRequired,
};