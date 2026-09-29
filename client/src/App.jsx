import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import AiTutor from './pages/AiTutor';
import PracticeQuiz from './pages/PracticeQuiz';
import Flashcards from './pages/Flashcards';
import QuizDiagnostic from './pages/QuizDiagnostic';
import SmartRevision from './pages/SmartRevision';

export default function App() {
  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col antialiased">
      <Header />
      <main className="flex flex-col relative w-full pt-16 pb-24 bg-surface flex-grow">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tutor" element={<AiTutor />} />
          <Route path="/quiz" element={<PracticeQuiz />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/diagnostic" element={<QuizDiagnostic />} />
          <Route path="/revision" element={<SmartRevision />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}
