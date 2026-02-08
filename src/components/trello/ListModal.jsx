// components/Trello/ListModal.jsx
const ListModal = ({
  listDetails,
  cards = [],
  onClose,
  onRefresh,
  onSelectList,
  onScrollToForm
}) => {
  if (!listDetails) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{listDetails.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {cards.length} cards in this list
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onRefresh(listDetails.id)}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-300 dark:border-gray-700 p-4 hover:shadow-md dark:hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">{card.name}</h4>
                  <a
                    href={card.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                  >
                    ↗
                  </a>
                </div>
                
                {card.desc && (
                  <div className="mb-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line">{card.desc}</p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(card.url);
                      alert('Card link copied!');
                    }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy Link
                  </button>
                  
                  <button
                    onClick={() => window.open(card.url, '_blank')}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto"
                  >
                    Open in Trello
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {cards.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No cards in this list</h4>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Create the first card for this list</p>
              <button
                onClick={() => {
                  onSelectList(listDetails.id);
                  onClose();
                  onScrollToForm();
                }}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-500 dark:hover:to-green-600 text-white font-medium px-6 py-3 rounded-lg"
              >
                Create First Card
              </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListModal;