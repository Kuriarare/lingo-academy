import PropTypes from 'prop-types';

export const SkillCard = ({ title, tips, icon, gradient }) => {
    return (
      <div className={`${gradient} p-6 rounded-xl shadow-lg`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="text-white text-2xl">{icon}</div>
          <h3 className="text-white text-xl font-bold">{title}</h3>
        </div>
        <ul className="text-white space-y-2">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-[#11CDE7] mt-1">•</span>
              <span className="opacity-90 text-sm">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    );
};

SkillCard.propTypes = {
  title: PropTypes.string.isRequired,
  tips: PropTypes.arrayOf(PropTypes.string).isRequired,
  icon: PropTypes.node.isRequired,
  gradient: PropTypes.string.isRequired,
};