// components/Trello/TrelloBoardCard.jsx
const TrelloBoardCard = ({ board, isSelected, onClick }) => {
  return (
    <div
      className={`bg-white dark:bg-brand-dark-secondary rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-xl ${
        isSelected
          ? "border-blue-500 dark:border-blue-600 shadow-lg"
          : "border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-500"
      }`}
      onClick={() => onClick(board.id)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{board.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Click to view all lists and cards</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
            Board
          </div>
        </div>
        
        {board.url && (
          <div className="flex items-center justify-between mt-6">
            <a 
              href={board.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5c-1.11 0-2 .89-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7z"/>
              </svg>
              Open in Trello
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrelloBoardCard;