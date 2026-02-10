const LanguageFilter = ({ activeSection, setActiveSection }) => {
  const filters = [
    { id: "all", label: "All Languages", emoji: "🌍" },
    { id: "english", label: "English", emoji: "🇺🇸" },
    { id: "spanish", label: "Spanish", emoji: "🇪🇸" },
    { id: "polish", label: "Polish", emoji: "🇵🇱" }
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveSection(filter.id)}
          className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center ${
            activeSection === filter.id
              ? "bg-purple-600 dark:bg-brand-purple text-white shadow-lg"
              : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <span className="mr-2">{filter.emoji}</span>
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageFilter;