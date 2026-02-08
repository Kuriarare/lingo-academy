// utils/trelloAuth.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:2000';

// 1. Obtener token del backend
export const getTrelloToken = async (email) => {
  try {
    const response = await axios.get(`${API_BASE}/trello/token`, {
      params: { email }
    });
    
    // Si el backend devuelve token, lo usamos
    if (response.data && response.data.token) {
      localStorage.setItem('trello_token', response.data.token);
      return response.data.token;
    }
    
    return null;
  } catch (error) {
    console.log('No token found for user:', email);
    return null;
  }
};

// 2. Método MANUAL para obtener token
// 2. Método MANUAL mejorado para obtener token
// 2. Método MANUAL MEJORADO con textarea para copiar
export const startTrelloAuth = async (email) => {
  const apiKey = import.meta.env.VITE_TRELLO_API_KEY;
  
  // Genera URL para que el usuario la abra MANUALMENTE
  const trelloUrl = `https://trello.com/1/authorize?` +
    `expiration=never` +
    `&name=TuApp` +
    `&scope=read,write` +
    `&response_type=token` +
    `&key=${apiKey}`;
  
  // 1. Abre Trello automáticamente
  window.open(trelloUrl, '_blank');
  
  // 2. Crea un modal personalizado (mejor que prompt)
  return new Promise((resolve) => {
    // Crear elementos del modal
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 10px;
      max-width: 500px;
      width: 90%;
    `;
    
    modalContent.innerHTML = `
      <h2 style="margin-top: 0;">🔗 Conectar con Trello</h2>
      <p><strong>PASO 1:</strong> Ya se abrió Trello en nueva pestaña.</p>
      <p><strong>PASO 2:</strong> Haz click en "Permitir".</p>
      <p><strong>PASO 3:</strong> Copia el TOKEN que aparece.</p>
      <p><strong>PASO 4:</strong> Pega el token aquí:</p>
      
      <input type="text" id="trello-token-input" 
             placeholder="Pega aquí el token (empieza con ATT...)" 
             style="width: 100%; padding: 10px; margin: 10px 0; border: 2px solid #0079bf; border-radius: 5px;">
      
      <div style="margin-top: 20px;">
        <p><strong>Enlace manual por si no se abrió:</strong></p>
        <textarea id="trello-url" rows="2" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px;" readonly>${trelloUrl}</textarea>
        <button onclick="document.getElementById('trello-url').select(); document.execCommand('copy'); alert('¡Link copiado!')" 
                style="margin-top: 5px; padding: 5px 10px; background: #0079bf; color: white; border: none; border-radius: 3px; cursor: pointer;">
          📋 Copiar link
        </button>
      </div>
      
      <div style="margin-top: 20px; display: flex; gap: 10px;">
        <button id="trello-submit" style="padding: 10px 20px; background: #0079bf; color: white; border: none; border-radius: 5px; cursor: pointer; flex: 1;">
          ✅ Conectar
        </button>
        <button id="trello-cancel" style="padding: 10px 20px; background: #ccc; color: #333; border: none; border-radius: 5px; cursor: pointer; flex: 1;">
          ❌ Cancelar
        </button>
      </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Configurar eventos
    document.getElementById('trello-submit').onclick = () => {
      const tokenInput = document.getElementById('trello-token-input');
      const token = tokenInput.value.trim();
      
      if (token) {
        // Guardar token
        localStorage.setItem('trello_token', token);
        localStorage.setItem('trello_auth_email', email);
        
        // Guardar en backend
        axios.post(`${API_BASE}/trello/save-token`, {
          email,
          token
        })
        .then(() => console.log('✅ Token guardado'))
        .catch(err => console.error('Error:', err));
        
        // Cerrar modal y resolver
        document.body.removeChild(modal);
        resolve(token);
      } else {
        alert('Por favor, pega el token primero');
      }
    };
    
    document.getElementById('trello-cancel').onclick = () => {
      document.body.removeChild(modal);
      resolve(null);
    };
    
    // Auto-seleccionar input
    setTimeout(() => {
      document.getElementById('trello-token-input').focus();
    }, 100);
  });
};

// 3. Verificar si hay token en la URL (para compatibilidad)
export const checkForTokenInUrl = async () => {
  // Para el método manual, siempre retorna false
  // Pero mantenemos la función por si acaso
  return { success: false, token: null };
};

// 4. Función para debug
export const debugTrelloUrl = () => {
  console.log('🔍 DEBUG - Current URL:', window.location.href);
  console.log('🔍 DEBUG - Hash:', window.location.hash);
  console.log('🔍 DEBUG - Search:', window.location.search);
  return window.location.href;
};

// 5. Función auxiliar para obtener token del localStorage
export const getStoredToken = () => {
  return localStorage.getItem('trello_token');
};

// 6. Función para verificar si ya hay token
export const hasTrelloToken = (email) => {
  const token = localStorage.getItem('trello_token');
  return !!token; // Retorna true si hay token, false si no
};