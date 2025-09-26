import PropTypes from 'prop-types';

export const InfoCard = ({ question, answer, gradient }) => (
  <div className={`${gradient} p-6 rounded-lg transition-shadow duration-200`}>
    <h3 className="text-lg font-semibold text-gray-800 mb-3">{question}</h3>
    <p className="text-gray-600 leading-relaxed">{answer}</p>
  </div>
);

InfoCard.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  gradient: PropTypes.string.isRequired,
};