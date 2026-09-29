const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

// ── Student ──────────────────────────────────────────────────────────────────
export const getStudent = () => request('/student');

// ── AI Tutor ─────────────────────────────────────────────────────────────────
export const sendTutorMessage = (message, mode = 'explain', context = {}) =>
  request('/tutor/chat', {
    method: 'POST',
    body: JSON.stringify({ message, mode, context }),
  });

export const getTutorSuggestions = (topic = '') =>
  request(`/tutor/suggestions${topic ? `?topic=${encodeURIComponent(topic)}` : ''}`);

export const setTutorMode = (mode) =>
  request('/tutor/mode', {
    method: 'POST',
    body: JSON.stringify({ mode }),
  });

// ── Quiz ─────────────────────────────────────────────────────────────────────
export const getActiveQuiz = () => request('/quiz/active');

export const submitQuizAnswer = (questionId, answer) =>
  request('/quiz/submit', {
    method: 'POST',
    body: JSON.stringify({ questionId, answer }),
  });

export const getQuizDiagnostic = () => request('/quiz/diagnostic');

// ── Flashcards ───────────────────────────────────────────────────────────────
export const getFlashcardDecks = () => request('/flashcards/decks');

export const rateFlashcard = (cardId, rating) =>
  request('/flashcards/rate', {
    method: 'POST',
    body: JSON.stringify({ cardId, rating }),
  });

// ── Revision ─────────────────────────────────────────────────────────────────
export const getTodayRevision = () => request('/revision/today');

export const completeRevisionTask = (id) =>
  request(`/revision/${id}/complete`, { method: 'PATCH' });
