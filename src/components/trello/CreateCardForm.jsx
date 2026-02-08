// components/Trello/CreateCardForm.jsx
const CreateCardForm = ({
  boardLists,
  listCards,
  selectedList,
  setSelectedList,
  cardName,
  setCardName,
  cardDesc,
  setCardDesc,
  creatingCard,
  onSubmit,
  onScrollToForm
}) => {
  return (
    <div id="create-card-form" className="bg-gradient-to-br from-white to-gray-50 dark:from-brand-dark-secondary dark:to-gray-900/50 rounded-2xl shadow-lg p-6 sm:p-8 mb-12 border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 p-2 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Card</h3>
          <p className="text-gray-600 dark:text-gray-400">Add a new card to any list in this board</p>
        </div>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select List
            </label>
            <select
              value={selectedList}
              onChange={(e) => setSelectedList(e.target.value)}
              className="w-full p-3.5 border-2 border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all"
              required
            >
              <option value="" className="text-gray-500 dark:text-gray-400">Choose a list...</option>
              {boardLists.map((list) => (
                <option key={list.id} value={list.id} className="text-gray-900 dark:text-white">
                  {list.name} ({listCards[list.id]?.length || 0} cards)
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Card Name
            </label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full p-3.5 border-2 border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all"
              placeholder="Enter card title"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={cardDesc}
            onChange={(e) => setCardDesc(e.target.value)}
            className="w-full p-3.5 border-2 border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all"
            placeholder="Add a detailed description (optional)"
            rows="4"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={creatingCard || !selectedList || !cardName.trim()}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-500 dark:hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-700 dark:disabled:to-gray-800 text-white font-semibold py-3.5 px-8 sm:px-10 rounded-xl transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center w-full sm:w-auto"
          >
            {creatingCard ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Card
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCardForm;