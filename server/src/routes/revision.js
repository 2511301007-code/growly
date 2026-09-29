const express = require('express');
const router = express.Router();

// ---------------------------------------------------------------------------
// Revision plan data (spaced repetition)
// ---------------------------------------------------------------------------
const revisionSummary = {
  totalItems: 28,
  estimatedTime: '35 mins',
  retention: 84,
  criticalTopics: 3,
};

const revisionTasks = [
  {
    id: 'rev-1',
    priority: 'high',
    course: 'Operating Systems',
    title: "Deadlocks — Banker's Algorithm & Resource Allocation",
    duration: '15 mins',
    type: 'Adaptive Quiz',
    questions: 15,
    accuracy: 54,
    retentionDrop: 18,
    daysUntilExam: 4,
    masteryLevel: 54,
    completed: false,
  },
  {
    id: 'rev-2',
    priority: 'high',
    course: 'Operating Systems',
    title: 'Process Synchronization — Semaphores & Monitors',
    duration: '10 mins',
    type: 'Flashcard Review',
    cards: 12,
    lastReviewed: '3 days ago',
    retentionDrop: 12,
    masteryLevel: 61,
    completed: false,
  },
  {
    id: 'rev-3',
    priority: 'medium',
    course: 'Database Systems',
    title: 'Normalization (1NF–BCNF) — Dependency Mapping',
    duration: '8 mins',
    type: 'Concept Recap + Quiz',
    questions: 8,
    accuracy: 48,
    retentionDrop: 8,
    masteryLevel: 48,
    completed: false,
  },
  {
    id: 'rev-4',
    priority: 'low',
    course: 'Operating Systems',
    title: 'CPU Scheduling — SRTF & Priority Scheduling',
    duration: '5 mins',
    type: 'Quick Consolidation',
    cards: 6,
    lastReviewed: 'Yesterday',
    retentionDrop: 3,
    masteryLevel: 88,
    completed: false,
  },
];

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// GET /api/revision/today
router.get('/today', (_req, res) => {
  res.json({
    summary: revisionSummary,
    tasks: revisionTasks,
  });
});

// GET /api/revision/:id
router.get('/:id', (req, res) => {
  const task = revisionTasks.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Revision task not found' });
  }
  res.json(task);
});

// PATCH /api/revision/:id/complete
router.patch('/:id/complete', (req, res) => {
  const task = revisionTasks.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Revision task not found' });
  }

  task.completed = true;

  const remaining = revisionTasks.filter((t) => !t.completed);
  res.json({
    completed: task,
    remaining: remaining.length,
    totalCompleted: revisionTasks.filter((t) => t.completed).length,
  });
});

module.exports = router;
