import axios from 'axios';

// Dynamically resolve the API base from the script tag's src origin.
// This means: local dev (localhost:5000) → hits local server,
// Production (Vercel) → hits Vercel server. No hardcoding needed.
const getApiBase = () => {
  const scriptTag =
    document.currentScript ||
    document.querySelector('script[src*="quizora-widget"]');
  if (scriptTag?.src) {
    try {
      const origin = new URL(scriptTag.src).origin;
      return `${origin}/api`;
    } catch (_) {}
  }
  // Fallback for development
  return 'http://localhost:5000/api';
};

const API_BASE = getApiBase();

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

