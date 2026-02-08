// components/Trello/TrelloDashboard.jsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getTrelloToken, startTrelloAuth, checkForTokenInUrl } from "../../data/trelloAuth";
import { getTrelloBoards, getTrelloLists, createTrelloCard, getTrelloCards } from "../../data/trelloCards";
import TrelloBoardCard from "./TrelloBoardCard";
import TrelloListView from "./TrelloListView";
import CreateCardForm from "./CreateCardForm";
import ListModal from "./ListModal";

const TrelloDashboard = () => {
  const user = useSelector((state) => state.user.userInfo.user);
  const userEmail = user?.email || "";
  
  // Estados
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [boardLists, setBoardLists] = useState([]);
  const [listCards, setListCards] = useState({});
  
  const [selectedList, setSelectedList] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardDesc, setCardDesc] = useState("");
  const [creatingCard, setCreatingCard] = useState(false);
  const [selectedListDetails, setSelectedListDetails] = useState(null);

  // Efectos y funciones principales (las mismas que antes)
  useEffect(() => {
    if (userEmail) checkInitialToken();
  }, [userEmail]);

  useEffect(() => {
    const checkInterval = setInterval(async () => {
      const result = await checkForTokenInUrl();
      if (result.success) {
        setSuccess("✅ Connected to Trello!");
        clearInterval(checkInterval);
        loadUserBoards();
      }
    }, 1000);
    setTimeout(() => clearInterval(checkInterval), 30000);
    return () => clearInterval(checkInterval);
  }, []);

  const checkInitialToken = async () => {
    setLoading(true);
    try {
      const token = await getTrelloToken(userEmail);
      if (token) await loadUserBoards();
    } catch (error) {
      console.log("No token found");
    } finally {
      setLoading(false);
    }
  };

  const loadUserBoards = async () => {
    if (!userEmail) return;
    setLoading(true);
    setError("");
    try {
      const userBoards = await getTrelloBoards(userEmail);
      setBoards(userBoards);
      if (userBoards.length === 0) {
        setError("No boards found. Create a board in Trello first.");
      }
    } catch (error) {
      setError("Error loading boards. Please reconnect to Trello.");
    } finally {
      setLoading(false);
    }
  };

  const loadFullBoard = async (boardId) => {
    if (!userEmail || !boardId) return;
    setLoading(true);
    setError("");
    try {
      const lists = await getTrelloLists(boardId, userEmail);
      setBoardLists(lists);
      
      const allCards = {};
      const cardPromises = lists.map(async (list) => {
        try {
          const cards = await getTrelloCards(list.id, userEmail);
          allCards[list.id] = cards;
          return { listId: list.id, cards };
        } catch (err) {
          allCards[list.id] = [];
          return { listId: list.id, cards: [] };
        }
      });
      
      await Promise.all(cardPromises);
      setListCards(allCards);
    } catch (error) {
      setError("Error loading board data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBoardSelect = async (boardId) => {
    setSelectedBoard(boardId);
    setSelectedList("");
    setCardName("");
    setCardDesc("");
    setBoardLists([]);
    setListCards({});
    setSelectedListDetails(null);
    await loadFullBoard(boardId);
  };

  const handleConnectTrello = async () => {
    if (!userEmail) {
      setError("Please log in first");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = await startTrelloAuth(userEmail);
      if (token) {
        setSuccess("✅ Connected to Trello successfully!");
        setTimeout(() => loadUserBoards(), 500);
      } else {
        setError("No token provided. Please try again.");
      }
    } catch (error) {
      setError("Error connecting to Trello: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!selectedList || !cardName.trim() || !userEmail) {
      setError("Please select a list and enter card name");
      return;
    }
    setCreatingCard(true);
    setError("");
    setSuccess("");
    try {
      await createTrelloCard(selectedList, {
        name: cardName,
        description: cardDesc
      }, userEmail);
      setSuccess("✅ Card created successfully!");
      setCardName("");
      setCardDesc("");
      if (selectedList) {
        const refreshedCards = await getTrelloCards(selectedList, userEmail);
        setListCards(prev => ({ ...prev, [selectedList]: refreshedCards }));
      }
    } catch (error) {
      setError("Error creating card: " + (error.message || "Please try again"));
    } finally {
      setCreatingCard(false);
    }
  };

  const openListModal = (list) => {
    setSelectedListDetails(list);
  };

  const closeListModal = () => {
    setSelectedListDetails(null);
  };

  const refreshList = async (listId) => {
    if (!userEmail || !listId) return;
    try {
      const refreshedCards = await getTrelloCards(listId, userEmail);
      setListCards(prev => ({ ...prev, [listId]: refreshedCards }));
      setSuccess(`✅ List refreshed (${refreshedCards.length} cards)`);
    } catch (error) {
      console.error("Error refreshing list:", error);
    }
  };

  const scrollToForm = () => {
    document.getElementById('create-card-form')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleAddCard = (listId) => {
    setSelectedList(listId);
    scrollToForm();
  };

  const handleCardClick = (url) => {
    window.open(url, '_blank');
  };

return (
  <div className="w-full max-w-7xl mx-auto px-4 py-8">
    {/* Header "Trello Integration" - SOLO mostrar si NO HAY boards */}
    {boards.length === 0 && (
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Trello Integration</h1>
    )}
    
    {/* Status Messages */}
    {error && (
      <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
        {error}
      </div>
    )}
    {success && (
      <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-4">
        {success}
      </div>
    )}
    
    {/* Connect Button - SOLO mostrar si NO HAY boards */}
    {boards.length === 0 && !loading && (
      <div className="bg-white dark:bg-brand-dark-secondary rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Connect Trello</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Connect your Trello account to manage boards and cards</p>
          </div>
          <button
            onClick={handleConnectTrello}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            Connect Trello
          </button>
        </div>
      </div>
    )}
    
    {/* Boards Section - SOLO mostrar si HAY boards */}
    {boards.length > 0 && (
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Your Trello Boards</h3>
          {/* <button onClick={loadUserBoards} className="text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg">
            Refresh Boards
          </button> */}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <TrelloBoardCard
              key={board.id}
              board={board}
              isSelected={selectedBoard === board.id}
              onClick={handleBoardSelect}
            />
          ))}
        </div>
      </div>
    )}
    
    {/* Board View - Listas */}
    {selectedBoard && boardLists.length > 0 && (
      <>
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Board View</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">All lists and cards in this board</p>
            </div>
            <button
              onClick={() => loadFullBoard(selectedBoard)}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 dark:from-green-600 dark:to-green-700 dark:hover:from-green-500 dark:hover:to-green-600 text-white font-medium px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center"
            >
              Refresh Board
            </button>
          </div>
          
          {/* Listas en vista horizontal */}
          <div className="flex gap-6 overflow-x-auto pb-6 px-2">
            {boardLists.map((list) => (
              <TrelloListView
                key={list.id}
                list={list}
                cards={listCards[list.id] || []}
                onViewAll={openListModal}
                onRefresh={refreshList}
                onAddCard={handleAddCard}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        </div>
        
        {/* Formulario para crear tarjetas */}
        <CreateCardForm
          boardLists={boardLists}
          listCards={listCards}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
          cardName={cardName}
          setCardName={setCardName}
          cardDesc={cardDesc}
          setCardDesc={setCardDesc}
          creatingCard={creatingCard}
          onSubmit={handleCreateCard}
          onScrollToForm={scrollToForm}
        />
      </>
    )}
    
    {/* Modal para lista */}
    <ListModal
      listDetails={selectedListDetails}
      cards={selectedListDetails ? listCards[selectedListDetails.id] || [] : []}
      onClose={closeListModal}
      onRefresh={refreshList}
      onSelectList={setSelectedList}
      onScrollToForm={scrollToForm}
    />
    
    {/* Loading State */}
    {loading && !boards.length && (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 dark:border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">Loading your Trello data...</p>
      </div>
    )}
  </div>
);
};

export default TrelloDashboard;