const express = require('express');
const router = express.Router();

// ---------------------------------------------------------------------------
// Flashcard data
// ---------------------------------------------------------------------------
const deckState = {
  sessionTitle: 'Operating Systems · Process Management',
  currentCard: 14,
  totalCards: 32,
  completedPercent: 44,
  sessionStats: {
    again: 2,
    hard: 4,
    good: 5,
    easy: 3,
  },
};

const cards = [
  {
    id: 14,
    category: 'Concepts & Definitions',
    difficulty: 'Hard',
    question: {
      label: 'QUESTION',
      text: 'What is the difference between a Preemptive and Non-Preemptive Kernel, and why does Preemption prevent priority inversion with priority inheritance?',
      hint: {
        label: 'Cognitive Hint',
        text: 'Focus on context switching mechanics during interrupt handling and nested task states.',
      },
    },
    answer: {
      label: 'KEY TAKEAWAY & PROOF',
      verifiedBy: 'Verified by AI Tutor',
      points: [
        {
          bold: 'Non-preemptive:',
          text: 'Does not allow a process running in kernel mode to be interrupted until it exits kernel mode or blocks.',
        },
        {
          bold: 'Preemptive:',
          text: 'Allows preemption even in kernel mode, ensuring real-time responsiveness for high-priority tasks.',
        },
        {
          bold: 'Priority Inheritance:',
          text: 'Dynamically elevates the low-priority thread holding a critical resource to the priority of the highest awaiting task.',
        },
      ],
      source: 'Silberschatz, Ch. 6.4 · Verified by AI Tutor',
      mappedTo: 'OS Midterm · Unit 3',
    },
  },
  {
    id: 15,
    category: 'Algorithms',
    difficulty: 'Medium',
    question: {
      label: 'QUESTION',
      text: 'Explain the difference between FCFS and Round Robin CPU scheduling algorithms. When would RR outperform FCFS?',
      hint: {
        label: 'Cognitive Hint',
        text: 'Consider the impact of time quantum on response time and throughput.',
      },
    },
    answer: {
      label: 'KEY TAKEAWAY',
      verifiedBy: 'Verified by AI Tutor',
      points: [
        {
          bold: 'FCFS:',
          text: 'First Come First Served — non-preemptive, simple but causes convoy effect with long processes.',
        },
        {
          bold: 'Round Robin:',
          text: 'Preemptive with fixed time quantum. Better response time for interactive systems.',
        },
        {
          bold: 'RR advantage:',
          text: 'Outperforms FCFS when process burst times vary widely, ensuring fairness and lower average waiting time for short processes.',
        },
      ],
      source: 'Silberschatz, Ch. 5.3',
      mappedTo: 'OS Midterm · Unit 2',
    },
  },
];

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// GET /api/flashcards/decks
router.get('/decks', (_req, res) => {
  const currentCard = cards.find((c) => c.id === deckState.currentCard);
  res.json({
    ...deckState,
    card: currentCard || null,
  });
});

// GET /api/flashcards/card/:id
router.get('/card/:id', (req, res) => {
  const card = cards.find((c) => c.id === parseInt(req.params.id));
  if (!card) {
    return res.status(404).json({ error: 'Card not found' });
  }
  res.json(card);
});

// POST /api/flashcards/rate
router.post('/rate', (req, res) => {
  const { cardId, rating } = req.body;
  const validRatings = ['again', 'hard', 'good', 'easy'];

  if (!cardId || !validRatings.includes(rating)) {
    return res.status(400).json({
      error: `cardId required and rating must be one of: ${validRatings.join(', ')}`,
    });
  }

  // Update session stats
  deckState.sessionStats[rating] += 1;
  deckState.currentCard += 1;
  deckState.completedPercent = Math.round((deckState.currentCard / deckState.totalCards) * 100);

  const nextCard = cards.find((c) => c.id === deckState.currentCard);

  res.json({
    rated: rating,
    nextCard: nextCard || null,
    progress: {
      currentCard: deckState.currentCard,
      totalCards: deckState.totalCards,
      completedPercent: deckState.completedPercent,
      sessionStats: deckState.sessionStats,
    },
  });
});

// POST /api/flashcards/shuffle
router.post('/shuffle', (_req, res) => {
  // In a real app, this would randomize the card order
  res.json({ shuffled: true, message: 'Deck shuffled successfully' });
});

module.exports = router;
