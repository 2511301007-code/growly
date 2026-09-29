const express = require('express');
const router = express.Router();

// ---------------------------------------------------------------------------
// Quiz state
// ---------------------------------------------------------------------------
let quizState = {
  id: 'quiz-os-deadlocks',
  course: 'CS 301',
  topic: "Deadlocks • Banker's Algo",
  level: 3,
  levelLabel: 'ADVANCED',
  currentQuestion: 7,
  totalQuestions: 15,
  timeRemaining: 858, // seconds (14:18)
  isPaused: false,
  completedPercent: 46,
  answeredQuestions: [
    { id: 1, correct: true },
    { id: 2, correct: true },
    { id: 3, correct: true },
    { id: 4, correct: false },
    { id: 5, correct: true },
    { id: 6, correct: true },
  ],
};

const questions = [
  {
    id: 7,
    category: 'Multi-Resource Safety',
    priority: 'Exam Priority',
    prompt: 'Given a system with 5 processes (P0–P4) and 3 resource types (A:10, B:5, C:7). If process P1 issues request (1, 0, 2), will the system remain in a safe state according to the Banker\'s Algorithm?',
    matrix: {
      available: [3, 3, 2],
      processes: [
        { name: 'P0', alloc: [0, 1, 0], max: [7, 5, 3], need: [7, 4, 3] },
        { name: 'P1', alloc: [2, 0, 0], max: [3, 2, 2], need: [1, 2, 2], highlighted: true },
        { name: 'P2', alloc: [3, 0, 2], max: [9, 0, 2], need: [6, 0, 0] },
        { name: 'P3', alloc: [2, 1, 1], max: [2, 2, 2], need: [0, 1, 1] },
        { name: 'P4', alloc: [0, 0, 2], max: [4, 3, 3], need: [4, 3, 1] },
      ],
    },
    options: [
      {
        id: 'a',
        text: 'Yes — Safe. Safe sequence ⟨P1, P3, P4, P0, P2⟩ exists after granting.',
        correct: true,
      },
      {
        id: 'b',
        text: 'No — Unsafe. Granting causes Available to drop below all remaining Need vectors.',
        correct: false,
      },
      {
        id: 'c',
        text: 'Cannot determine — insufficient information about Max matrix.',
        correct: false,
      },
      {
        id: 'd',
        text: 'Yes — Safe, but only because P0 can release first.',
        correct: false,
      },
    ],
    explanation: {
      correct: 'After granting (1, 0, 2) to P1: Available becomes [2, 3, 0]. P1\'s allocation is [3, 0, 2]. When P1 finishes → Available = [5, 3, 2]. Then P3 (Need=[0,1,1]) → [7, 4, 3]. Then P4 → [7, 4, 5]. Then P0 → [7, 5, 5]. Then P2 → [10, 5, 7]. Safe sequence exists ✅',
      incorrect: 'The request can be granted safely. Work through the safety algorithm step by step: after tentatively allocating, check if a safe sequence exists by finding processes whose Need ≤ Available.',
    },
  },
];

const diagnosticReport = {
  score: 78,
  totalPoints: 90,
  masteryPercent: 87,
  proficiencyLabel: 'Strong Proficiency',
  predictedReadiness: 84,
  accuracy: { correct: 13, total: 15, cohortDiff: '+14%' },
  timeEfficiency: { avgPerQuestion: '57s', benchmark: '72s', label: 'Faster than target' },
  focusAreas: { critical: 2, topics: ['Deadlock Avoidance', 'Safe State Verification'] },
  readinessScore: { value: 84, label: 'Exam Ready' },
  xpEarned: 120,
  streakKept: 12,
  topicBreakdown: [
    { topic: 'Deadlock Prevention', correct: 3, total: 3, mastery: 100, status: 'mastered' },
    { topic: 'Banker\'s Algorithm', correct: 4, total: 5, mastery: 80, status: 'strong' },
    { topic: 'Resource Allocation Graph', correct: 3, total: 3, mastery: 100, status: 'mastered' },
    { topic: 'Safe State Verification', correct: 2, total: 3, mastery: 67, status: 'needs_review' },
    { topic: 'Deadlock Detection', correct: 1, total: 1, mastery: 100, status: 'mastered' },
  ],
  questionReview: [
    { id: 4, topic: 'Safe State Verification', result: 'incorrect', yourAnswer: 'B', correctAnswer: 'A' },
    { id: 11, topic: 'Banker\'s Algorithm', result: 'incorrect', yourAnswer: 'C', correctAnswer: 'D' },
  ],
};

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// GET /api/quiz/active
router.get('/active', (_req, res) => {
  const currentQ = questions.find((q) => q.id === quizState.currentQuestion);
  res.json({
    ...quizState,
    question: currentQ || null,
  });
});

// POST /api/quiz/submit
router.post('/submit', (req, res) => {
  const { questionId, answerId } = req.body;

  if (!questionId || !answerId) {
    return res.status(400).json({ error: 'questionId and answerId are required' });
  }

  const question = questions.find((q) => q.id === questionId);
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  const selectedOption = question.options.find((o) => o.id === answerId);
  const isCorrect = selectedOption?.correct || false;

  quizState.answeredQuestions.push({ id: questionId, correct: isCorrect });
  quizState.currentQuestion += 1;
  quizState.completedPercent = Math.round(
    (quizState.answeredQuestions.length / quizState.totalQuestions) * 100
  );

  res.json({
    correct: isCorrect,
    explanation: isCorrect ? question.explanation.correct : question.explanation.incorrect,
    nextQuestion: quizState.currentQuestion <= quizState.totalQuestions ? quizState.currentQuestion : null,
    progress: quizState.completedPercent,
  });
});

// POST /api/quiz/pause
router.post('/pause', (_req, res) => {
  quizState.isPaused = !quizState.isPaused;
  res.json({ isPaused: quizState.isPaused });
});

// GET /api/quiz/diagnostic
router.get('/diagnostic', (_req, res) => {
  res.json(diagnosticReport);
});

module.exports = router;
