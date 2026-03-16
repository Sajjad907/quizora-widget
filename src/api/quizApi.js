import axios from 'axios';

let API_BASE = 'http://localhost:5000/api';

/**
 * Update the API base URL from the entry point (EmbedBundle).
 * This ensures the widget always hits the correct production/local server.
 */
export const setApiBase = (url) => {
  if (!url) return;
  // Strip trailing slash if any
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  // If no protocol or path, assume it's just origin and add /api
  API_BASE = cleanUrl.includes('/api') ? cleanUrl : `${cleanUrl}/api`;
  console.log("Quizora API Base set to:", API_BASE);
};

export const getQuiz = async (handle) => {
  const res = await axios.get(`${API_BASE}/quizzes/widget/${handle}`);
  return res.data;
};

export const startSession = async (quizId, storeId = 'test-store') => {
  const res = await axios.post(`${API_BASE}/sessions`, {
    quizId,
    storeId,
    device: window.innerWidth < 768 ? 'mobile' : 'desktop',
    browser: navigator.userAgent
  });
  return res.data;
};

export const updateSession = async (sessionId, answers) => {
  const res = await axios.patch(`${API_BASE}/sessions/${sessionId}`, {
    answers,
    status: 'in_progress'
  });
  return res.data;
};

export const submitQuiz = async (quizId, answers, sessionId, contactInfo) => {
  const res = await axios.post(`${API_BASE}/quizzes/submit`, {
    quizId,
    answers,
    sessionId,
    contactInfo
  });
  return res.data;
};

// Also keep the object export for backward compatibility if any
export const quizApi = {
  getQuizByHandle: getQuiz,
  startSession,
  updateSession,
  submitQuiz
};

