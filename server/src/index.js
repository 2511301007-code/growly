const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Simple request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
const studentRoutes = require('./routes/student');
const tutorRoutes = require('./routes/tutor');
const quizRoutes = require('./routes/quiz');
const flashcardRoutes = require('./routes/flashcards');
const revisionRoutes = require('./routes/revision');

app.use('/api/student', studentRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/revision', revisionRoutes);

// Health-check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`\n🚀 Growly API Server running on http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Client URL  : ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`   Gemini Key  : ${process.env.GEMINI_API_KEY ? '✅ Configured' : '⚠️  Not set (using fallback responses)'}\n`);
});
