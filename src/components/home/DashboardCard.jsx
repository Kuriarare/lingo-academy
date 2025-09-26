import PropTypes from 'prop-types';

export const DashboardCard = ({ title, value, icon, gradient }) => (
  <div className={`${gradient} p-6 rounded-lg transition-colors duration-200`}>
    <div className="flex items-center justify-between text-white">
      <div>
        <p className="text-sm font-medium mb-2">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <div className="p-3 bg-white/10 rounded-full">
        {icon}
      </div>
    </div>
  </div>
);


DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  gradient: PropTypes.string.isRequired,
};