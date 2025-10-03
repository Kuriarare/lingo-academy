const CoursesCard = ({ title, description, image, button, level, duration }) => {
  return (
    <div className="bg-white dark:bg-brand-dark-secondary rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col border border-gray-200 dark:border-purple-500/20">
      <div className="relative">
        <img className="w-full h-56 object-cover" src={image} alt={title} />
        <div className="absolute top-4 left-4 bg-purple-600 dark:bg-brand-purple text-white py-1 px-3 rounded-full text-sm font-semibold">
          {level}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow min-h-[6rem]">{description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>{duration}</span>
        </div>
        <button className="w-full bg-purple-600 dark:bg-brand-purple text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 dark:hover:bg-brand-orange transition-colors duration-300 flex items-center justify-center mt-auto">
          {button}
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CoursesCard;