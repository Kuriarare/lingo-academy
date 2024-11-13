import PropTypes from 'prop-types';

export const DashboardCard = ({ title, value, icon, gradient }) => {
  return (
    <div className={`${gradient} p-6 rounded-xl shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-medium mb-1">{title}</p>
          <h3 className="text-white text-2xl font-bold">{value}</h3>
        </div>
        <div className="text-white text-3xl opacity-80">
          {icon}
        </div>
      </div>
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  gradient: PropTypes.string.isRequired,
};