// components/Trello/TrelloListView.jsx
const TrelloListView = ({ 
  list, 
  cards = [], 
  onViewAll, 
  onRefresh, 
  onAddCard,
  onCardClick 
}) => {
  return (
    <div className="flex-shrink-0 w-72 sm:w-80 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
      {/* Encabezado de lista */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-bold text-gray-900 dark:text-white text-lg truncate">{list.name}</h4>
          <div className="flex items-center gap-2">
            <span className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full min-w-[2rem] text-center">
              {cards.length}
            </span>
            <button
              onClick={() => onRefresh(list.id)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1"
              title="Refresh list"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
        
        <button
          onClick={() => onViewAll(list)}
          className="w-full text-left text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center justify-between"
        >
          <span>View all cards ({cards.length})</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Vista previa de tarjetas */}
      <div className="p-3 space-y-3 max-h-96 overflow-y-auto">
        {cards.slice(0, 3).map((card) => (
          <div
            key={card.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-3 hover:shadow-md dark:hover:shadow-lg transition cursor-pointer"
            onClick={() => onCardClick(card.url)}
          >
            <h5 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">{card.name}</h5>
            {card.desc && (
              <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 mb-2">{card.desc}</p>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">Click to open</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(card.url);
                  alert('Link copied!');
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Copy
              </button>
            </div>
          </div>
        ))}
        
        {cards.length === 0 && (
          <div className="text-center text-gray-400 dark:text-gray-500 py-4 text-sm">
            No cards in this list
          </div>
        )}
        
        {cards.length > 3 && (
          <div className="text-center pt-2">
            <button
              onClick={() => onViewAll(list)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
            >
              + {cards.length - 3} more cards
            </button>
          </div>
        )}
      </div>
      
      {/* Botón para añadir tarjeta */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => onAddCard(list.id)}
          className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 py-2 rounded text-sm font-medium flex items-center justify-center transition"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add a card
        </button>
      </div>
    </div>
  );
};

export default TrelloListView;