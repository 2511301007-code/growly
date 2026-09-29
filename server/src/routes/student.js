const express = require('express');
const router = express.Router();

// ---------------------------------------------------------------------------
// In-memory student data (simulates a database)
// ---------------------------------------------------------------------------
const studentProfile = {
  id: 'stu_001',
  name: 'Aryan',
  avatar: null,
  streak: 12,
  personalBest: true,
  studyTime: { current: 135, goal: 180, unit: 'minutes' },
  questionsSolved: { today: 14, total: 48, target: 60 },
  overallMastery: 82,
  masteryChange: 4,
  xp: 2450,
  courses: [
    {
      id: 'os-301',
      name: 'Operating Systems',
      icon: 'memory',
      topics: [
        { id: 'os-t1', name: 'Deadlocks & Synchronization', mastery: 54, status: 'critical' },
        { id: 'os-t2', name: 'CPU Scheduling Algorithms', mastery: 72, status: 'review' },
        { id: 'os-t3', name: 'Process States & PCB', mastery: 92, status: 'strong' },
        { id: 'os-t4', name: 'Memory Management & Segmentation', mastery: 69, status: 'review' },
      ],
    },
    {
      id: 'db-302',
      name: 'Database Systems',
      icon: 'storage',
      topics: [
        { id: 'db-t1', name: 'Normalization (1NF–BCNF)', mastery: 48, status: 'critical' },
        { id: 'db-t2', name: 'Transactions & Concurrency', mastery: 63, status: 'review' },
      ],
    },
  ],
  upcomingExams: [
    {
      id: 'exam-001',
      title: 'Operating Systems Midterm',
      daysLeft: 4,
      preparedness: 78,
      courseId: 'os-301',
    },
  ],
  studySuggestions: [
    {
      id: 'sug-1',
      topic: 'Deadlocks (Operating Systems)',
      questions: 15,
      accuracy: 54,
      reason: 'Low accuracy (54%) · Midterm in 4 days',
      priority: 'high',
    },
    {
      id: 'sug-2',
      topic: 'CPU Scheduling Algorithms',
      cards: 10,
      reason: 'Due for memory consolidation review',
      priority: 'medium',
    },
    {
      id: 'sug-3',
      topic: 'Process States & PCB',
      duration: '5m recap',
      confidence: 92,
      reason: 'Confidence steady (92%) · Quick refresher',
      priority: 'low',
    },
  ],
  continueItems: [
    {
      id: 'cont-1',
      title: 'Normalization (1NF–BCNF)',
      course: 'Database Systems',
      mastery: 48,
      action: 'Practice Quiz',
      status: 'critical',
    },
    {
      id: 'cont-2',
      title: 'Transactions & Concurrency',
      course: 'Database Systems',
      mastery: 63,
      action: 'Ask AI Tutor',
      status: 'review',
    },
    {
      id: 'cont-3',
      title: 'Memory Management & Segmentation',
      course: 'Operating Systems',
      mastery: 69,
      action: 'Review Cards',
      status: 'review',
    },
  ],
};

// GET /api/student
router.get('/', (_req, res) => {
  res.json(studentProfile);
});

// GET /api/student/streak
router.get('/streak', (_req, res) => {
  res.json({
    current: studentProfile.streak,
    personalBest: studentProfile.personalBest,
  });
});

// GET /api/student/stats
router.get('/stats', (_req, res) => {
  res.json({
    studyTime: studentProfile.studyTime,
    questionsSolved: studentProfile.questionsSolved,
    overallMastery: studentProfile.overallMastery,
    masteryChange: studentProfile.masteryChange,
    streak: studentProfile.streak,
    xp: studentProfile.xp,
  });
});

module.exports = router;
