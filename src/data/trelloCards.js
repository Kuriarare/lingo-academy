// utils/trelloCards.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:2000';

// 1. Obtener tableros DESDE TU BACKEND
export const getTrelloBoards = async (email) => {
  try {
    // Primero obtener token
    const tokenResponse = await axios.get(`${API_BASE}/trello/token`, {
      params: { email }
    });
    
    const token = tokenResponse.data.token;
    
    if (!token) {
      throw new Error('No Trello token found');
    }
    
    // Llamar a TU backend para obtener tableros
    const boardsResponse = await axios.get(`${API_BASE}/trello/boards`, {
      params: { email }
    });
    
    return boardsResponse.data.boards || [];
  } catch (error) {
    console.error('Error getting boards:', error);
    return [];
  }
};

// 2. Obtener listas DESDE TU BACKEND
export const getTrelloLists = async (boardId, email) => {
  try {
    const response = await axios.get(`${API_BASE}/trello/lists`, {
      params: { email, boardId }
    });
    
    return response.data.lists || [];
  } catch (error) {
    console.error('Error getting lists:', error);
    return [];
  }
};

// 3. Crear tarjeta DESDE TU BACKEND
export const createTrelloCard = async (listId, cardData, email) => {
  try {
    const response = await axios.post(`${API_BASE}/trello/create-card`, {
      email,
      listId,
      ...cardData
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating card:', error);
    throw error;
  }
};

// 4. Obtener tarjetas de una lista DESDE TU BACKEND
export const getTrelloCards = async (listId, email) => {
  try {
    console.log('🔍 Getting cards for list:', listId, 'email:', email);
    
    const response = await axios.get(`${API_BASE}/trello/cards`, {
      params: { 
        email: email,
        listId: listId 
      }
    });
    
    console.log('✅ Cards received:', response.data.cards?.length || 0);
    return response.data.cards || [];
  } catch (error) {
    console.error('❌ Error getting cards:', error);
    
    // Si es error 404, el endpoint puede no estar listo
    if (error.response?.status === 404) {
      console.log('Endpoint /trello/cards not ready yet');
    }
    
    return [];
  }
};