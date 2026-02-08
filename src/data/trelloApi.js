import axios from "axios";
import { TRELLO_API_KEY, TRELLO_TOKEN, TRELLO_BASE_URL } from "../constants/trelloConfig";

// Obtiene los tableros del usuario
export const getTrelloBoards = async () => {
  try {
    const response = await axios.get(`${TRELLO_BASE_URL}/members/me/boards`, {
      params: {
        key: TRELLO_API_KEY,
        token: TRELLO_TOKEN,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error obteniendo tableros de Trello:", error);
    return [];
  }
};

// Puedes agregar más funciones para listas, tarjetas, etc.

// ENDPOINTS BACKEND LINGO-SERVER-NEST
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const getTrelloToken = async (email) => {
  const res = await axios.get(`${API_BASE}/trello/token`, { params: { email } });
  return res.data;
};

export const startTrelloOAuth = async (email) => {
  const res = await axios.get(`${API_BASE}/trello/auth`, { params: { email } });
  return res.data;
};

export const saveTrelloToken = async (email, token) => {
  const res = await axios.post(`${API_BASE}/trello/save-token`, { email, token });
  return res.data;
};