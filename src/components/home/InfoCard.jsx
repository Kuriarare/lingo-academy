import PropTypes from 'prop-types';
import { FiHelpCircle } from 'react-icons/fi';

export const InfoCard = ({ question, answer }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out">
    <div className="p-6">
      <div className="flex items-center mb-4">
        <FiHelpCircle className="text-3xl text-purple-600 mr-4" />
        <h3 className="text-xl font-bold text-gray-800">{question}</h3>
      </div>
      <p className="text-gray-600 leading-relaxed">{answer}</p>
    </div>
  </div>
);

InfoCard.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
};