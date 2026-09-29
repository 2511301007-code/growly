const express = require('express');
const router = express.Router();

// ---------------------------------------------------------------------------
// Pedagogical mode definitions
// ---------------------------------------------------------------------------
const MODES = {
  explain: {
    label: 'Explain',
    icon: 'psychology',
    description: 'Clear conceptual breakdown with analogies',
  },
  deep_dive: {
    label: 'Deep Dive',
    icon: 'travel_explore',
    description: 'Detailed technical exploration with proofs',
  },
  real_world: {
    label: 'Real-world Example',
    icon: 'lightbulb',
    description: 'Practical applications and case studies',
  },
  simplify: {
    label: 'Simplify',
    icon: 'compress',
    description: 'ELI5-style simple explanation',
  },
  socratic: {
    label: 'Socratic',
    icon: 'forum',
    description: 'Guided questioning to reach understanding',
  },
  quiz_me: {
    label: 'Quiz Me',
    icon: 'quiz',
    description: 'Test your understanding with quick questions',
  },
};

// ---------------------------------------------------------------------------
// In-memory conversation history & context
// ---------------------------------------------------------------------------
let activeContext = {
  course: 'Operating Systems',
  unit: 'Unit 3',
  topic: 'Process Synchronization',
  source: "Prof. Sharma's Lecture Deck",
  syllabusMatched: true,
  chapter: 'Chapter 7: Deadlocks & Synchronization',
};

let conversationHistory = [
  {
    id: 'msg-001',
    role: 'user',
    content: 'Can you explain the Dining Philosophers problem and how to prevent circular wait deadlock in simple terms?',
    timestamp: '10:42 AM',
  },
  {
    id: 'msg-002',
    role: 'assistant',
    mode: 'explain',
    content: {
      conceptSnapshot: {
        title: 'Concept Snapshot',
        body: 'Imagine <strong>5 thinkers</strong> sitting at a round table with only <strong>5 chopsticks</strong>. Each needs <em>two chopsticks</em> simultaneously to eat spaghetti. If every philosopher grabs their right stick at the exact same second, all are frozen holding one fork—waiting forever on their left neighbor. This is a classic <strong>Circular Wait deadlock</strong>.',
      },
      diagram: {
        title: 'Resource Sharing Graph',
        subtitle: 'N = 5 Circular Dep',
        type: 'dining_philosophers',
      },
      keyPoints: [
        {
          title: 'Circular Wait',
          body: 'Occurs when a chain of processes exists such that each holds a resource the next one needs, forming a closed loop. For N philosophers: P₀→P₁→P₂→…→Pₙ₋₁→P₀.',
        },
        {
          title: "Dijkstra's Fix: Resource Ordering",
          body: "Assign a global numeric ID to every chopstick (or resource). Force philosophers to always pick up the <strong>lower-numbered chopstick first</strong>. This breaks the circular chain because at least one philosopher (the one between the highest and lowest numbered) will reach for chopstick 0 first, which is already 'below' their other option.",
        },
        {
          title: 'Why It Works (Proof Sketch)',
          body: 'A cycle requires every process to hold resource Rₖ and wait on Rₖ₊₁ where the ordering wraps around. By enforcing Rᵢ < Rⱼ for every acquisition pair (i, j), such a wrap-around is mathematically impossible — contradicting the strict total order.',
        },
      ],
      examTip: "This is a high-frequency exam topic — expect a 'compare Circular Wait prevention vs. Banker\\'s Algorithm' question.",
    },
    timestamp: '10:42 AM',
    chapter: 'Chapter 7: Deadlocks & Synchronization',
  },
];

// Fallback response templates for when no API key is configured
const fallbackResponses = {
  explain: (question) => ({
    conceptSnapshot: {
      title: 'Concept Snapshot',
      body: `Great question about <strong>${question.slice(0, 60)}...</strong>. This is a fundamental concept in operating systems that connects to resource management and process coordination.`,
    },
    keyPoints: [
      {
        title: 'Core Concept',
        body: 'This topic involves understanding how operating systems manage concurrent access to shared resources while preventing deadlocks and ensuring fairness.',
      },
      {
        title: 'Key Insight',
        body: 'The fundamental trade-off is between <strong>safety</strong> (preventing deadlocks) and <strong>performance</strong> (maximizing resource utilization and throughput).',
      },
    ],
    examTip: 'Focus on understanding the conditions necessary for deadlock and the mathematical proofs behind prevention algorithms.',
  }),
  socratic: (question) => ({
    questions: [
      'What are the four necessary conditions for a deadlock to occur?',
      'Can you think of a real-world scenario where circular wait might happen?',
      'If we could eliminate just one condition, which would be most practical?',
    ],
    hint: 'Think about the relationship between resource allocation and process dependencies.',
  }),
};

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// GET /api/tutor/context
router.get('/context', (_req, res) => {
  res.json(activeContext);
});

// GET /api/tutor/modes
router.get('/modes', (_req, res) => {
  res.json(MODES);
});

// GET /api/tutor/history
router.get('/history', (_req, res) => {
  res.json(conversationHistory);
});

// GET /api/tutor/suggestions
router.get('/suggestions', (_req, res) => {
  res.json([
    {
      id: 'sug-1',
      icon: 'account_balance',
      text: "How does Dijkstra's solution contrast with the Banker's Algorithm?",
    },
    {
      id: 'sug-2',
      icon: 'balance',
      text: "Why doesn't breaking circular wait prevent starvation?",
    },
    {
      id: 'sug-3',
      icon: 'verified_user',
      text: 'Give me an exam-style multiple choice question on this.',
    },
  ]);
});

// POST /api/tutor/chat
router.post('/chat', (req, res) => {
  const { message, mode = 'explain' } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Add user message to history
  const userMsg = {
    id: `msg-${Date.now()}`,
    role: 'user',
    content: message,
    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
  conversationHistory.push(userMsg);

  // Generate fallback response (would use Gemini API if key is configured)
  const responseContent = fallbackResponses.explain(message);

  const assistantMsg = {
    id: `msg-${Date.now() + 1}`,
    role: 'assistant',
    mode,
    content: responseContent,
    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    chapter: activeContext.chapter || 'General',
  };
  conversationHistory.push(assistantMsg);

  res.json({
    userMessage: userMsg,
    assistantMessage: assistantMsg,
  });
});

// POST /api/tutor/mode
router.post('/mode', (req, res) => {
  const { mode } = req.body;
  if (!MODES[mode]) {
    return res.status(400).json({ error: `Invalid mode. Available: ${Object.keys(MODES).join(', ')}` });
  }
  res.json({ activeMode: MODES[mode] });
});

module.exports = router;
