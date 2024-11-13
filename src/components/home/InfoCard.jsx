import PropTypes from 'prop-types';

export const InfoCard = ({ question, answer, gradient }) => {
  return (
    <div className={`${gradient} p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02]`}>
      <h3 className="text-white text-xl font-bold mb-3">{question}</h3>
      <p className="text-white text-sm leading-relaxed opacity-90">
        {answer}
      </p>
    </div>
  );
};

InfoCard.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  gradient: PropTypes.string.isRequired,
};