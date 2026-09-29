import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizDiagnostic } from '../services/api';

const FALLBACK_DIAGNOSTIC = {
  score: 78,
  totalPoints: 90,
  masteryPercent: 87,
  proficiencyLabel: 'Strong Proficiency',
  predictedReadiness: 84,
  xpEarned: 120,
  streakKept: 12,
  accuracy: { correct: 13, total: 15, cohortDiff: '+14%' },
  timeEfficiency: { totalTime: '11m 42s', avgPerQuestion: '46s', label: 'Fast Pace' },
  adaptiveLevel: { current: '3.8', max: '5.0', note: 'Peak difficulty reached' },
  fsrsRetention: { days: 9, note: 'Decay safe until Oct 18' },
  topicBreakdown: [
    {
      name: "Banker's Algorithm & Safety Sequence",
      score: '100% (3/3)',
      mastery: 91,
      shift: '+15% shift',
      status: 'mastered',
    },
    {
      name: 'Resource Allocation Graphs (RAG)',
      score: '100% (4/4)',
      mastery: 95,
      shift: 'Solidified',
      status: 'mastered',
    },
    {
      name: "Dijkstra's Asymmetric Solution & Starvation",
      score: '50% (1/2)',
      mastery: 52,
      warning: 'Diagnostic: Confused wait() parameter ordering during edge acquisition',
      status: 'attention',
    },
    {
      name: 'Deadlock Detection vs Prevention Trade-offs',
      score: '66% (2/3)',
      mastery: 64,
      tip: "Recommendation: Revise Havender's hierarchical ordering conditions",
      status: 'attention',
    },
  ],
  questionReview: [
    { id: 1, topic: 'Mutual Exclusion Condition', correct: true, yourAnswer: 'A', answer: 'A', time: '38s' },
    { id: 2, topic: 'Hold and Wait Condition', correct: true, yourAnswer: 'C', answer: 'C', time: '42s' },
    { id: 3, topic: 'No Preemption Condition', correct: true, yourAnswer: 'B', answer: 'B', time: '35s' },
    { id: 4, topic: "Dijkstra's Asymmetric Solution", correct: false, yourAnswer: 'B', answer: 'A', explanation: 'Acquiring odd-even resource tokens prevents circular wait. Reversing wait order avoids starvation.', time: '74s' },
    { id: 5, topic: 'Circular Wait Detection', correct: true, yourAnswer: 'D', answer: 'D', time: '45s' },
    { id: 6, topic: 'Resource Allocation Graph Cycles', correct: true, yourAnswer: 'A', answer: 'A', time: '50s' },
    { id: 7, topic: "Banker's Algorithm: Need Vector", correct: true, yourAnswer: 'A', answer: 'A', time: '65s' },
    { id: 8, topic: "Banker's Safety Sequence", correct: true, yourAnswer: 'C', answer: 'C', time: '55s' },
    { id: 9, topic: "Havender's Hierarchical Ordering", correct: false, yourAnswer: 'C', answer: 'B', explanation: 'Havender proved that strictly ordering resource classes and requiring monotone acquisition strictly prevents circular wait.', time: '68s' },
    { id: 10, topic: 'Resource Preemption Feasibility', correct: true, yourAnswer: 'B', answer: 'B', time: '40s' },
    { id: 11, topic: 'Safe vs Unsafe State Distinction', correct: true, yourAnswer: 'A', answer: 'A', time: '32s' },
    { id: 12, topic: 'Multi-instance Resource Graph', correct: true, yourAnswer: 'D', answer: 'D', time: '48s' },
    { id: 13, topic: 'Knot Theory in Deadlocks', correct: true, yourAnswer: 'B', answer: 'B', time: '44s' },
    { id: 14, topic: 'Deadlock Recovery: Process Termination', correct: true, yourAnswer: 'A', answer: 'A', time: '36s' },
    { id: 15, topic: 'Checkpointing & Rollback Recovery', correct: true, yourAnswer: 'C', answer: 'C', time: '41s' },
  ],
};

export default function QuizDiagnostic() {
  const navigate = useNavigate();
  const [data, setData] = useState(FALLBACK_DIAGNOSTIC);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [cardsCreated, setCardsCreated] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  useEffect(() => {
    getQuizDiagnostic()
      .then((res) => {
        if (res && res.score !== undefined) {
          setData((prev) => ({
            ...prev,
            ...res,
            accuracy: res.accuracy || prev.accuracy,
            timeEfficiency: res.timeEfficiency || prev.timeEfficiency,
            topicBreakdown: res.topicBreakdown && res.topicBreakdown.length > 0 ? prev.topicBreakdown : prev.topicBreakdown,
            questionReview: res.questionReview && res.questionReview.length > 0 ? prev.questionReview : prev.questionReview,
          }));
        }
      })
      .catch(() => {
        // Use fallback data
      });
  }, []);

  const handleCreateCards = () => {
    setCardsCreated(true);
    setTimeout(() => {
      navigate('/flashcards');
    }, 1200);
  };

  const handleSchedule = () => {
    setScheduled(true);
  };

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (data.masteryPercent / 100) * circumference;

  return (
    <div className="flex-1 flex flex-col relative w-full px-gutter-mobile bg-surface">
      <div className="flex flex-col w-full pb-10 space-y-5 max-w-4xl mx-auto">
        {/* Celebration & Context Header */}
        <div className="flex flex-col space-y-1 pt-2">
          <div className="flex items-center gap-space-xs">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[14px]">verified</span> Diagnostic Completed
            </span>
            <span className="text-on-surface-variant font-label-sm text-label-sm">OS-302</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Quiz Diagnostic &amp; Mastery Report
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Operating Systems · Unit 3: Deadlocks &amp; Process Synchronization · Completed just now
          </p>
        </div>

        {/* Big Hero Score Card */}
        <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-all duration-300 border border-outline-variant/30">
          <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-secondary-container/15 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-tertiary-fixed/30 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center sm:flex-row sm:items-center justify-between gap-space-md">
            {/* Left side: Gauge ring & Big score numbers */}
            <div className="flex items-center gap-space-md w-full sm:w-auto">
              <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
                <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="transparent" r={radius} stroke="#eceef0" strokeWidth="8" />
                  <circle
                    className="transition-all duration-1000 ease-out"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r={radius}
                    stroke="#fea619"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    strokeWidth="8"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="font-headline-lg text-headline-lg leading-none text-on-surface tracking-tighter font-bold">
                    {data.masteryPercent}
                    <span className="font-label-sm text-label-sm text-secondary font-bold">%</span>
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase mt-0.5 font-medium">
                    Mastery
                  </span>
                </div>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-baseline gap-1">
                  <span className="font-display-lg-mobile text-display-lg-mobile font-bold text-on-surface tracking-tight">
                    {data.score}
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface-variant">
                    / {data.totalPoints}
                  </span>
                  <span className="ml-2 font-label-md text-label-md text-on-tertiary-container font-semibold">
                    Points
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm font-medium">
                    <span className="material-symbols-outlined text-[13px] text-secondary">target</span>
                    {data.proficiencyLabel}
                  </span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Exam Predicted Readiness:{' '}
                  <strong className="text-on-surface font-semibold">{data.predictedReadiness}%</strong>
                </span>
              </div>
            </div>

            {/* Streak & XP Micro-Pill Panel */}
            <div className="w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end gap-2 pt-2 sm:pt-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface shadow-sm">
                <span className="material-symbols-outlined text-secondary text-[18px]">bolt</span>
                <span className="font-label-md text-label-md font-semibold text-on-surface">+{data.xpEarned} XP</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">earned</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary-fixed/50 text-on-secondary-fixed shadow-sm">
                <span className="material-symbols-outlined text-secondary text-[18px]">local_fire_department</span>
                <span className="font-label-md text-label-md font-bold">{data.streakKept} Days</span>
                <span className="font-body-sm text-body-sm text-on-secondary-fixed-variant">Streak kept</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Statistics Grid (2x2 layout) */}
        <div className="grid grid-cols-2 gap-space-sm">
          {/* Stat 1: Accuracy */}
          <div className="flex flex-col justify-between p-3.5 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">Accuracy</span>
              <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">done_all</span>
            </div>
            <div className="mt-2">
              <div className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
                {data.accuracy.correct} / {data.accuracy.total}
              </div>
              <div className="flex items-center gap-1 mt-1 text-on-tertiary-container">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span className="font-label-sm text-label-sm font-semibold">{data.accuracy.cohortDiff} vs cohort</span>
              </div>
            </div>
          </div>

          {/* Stat 2: Time Efficiency */}
          <div className="flex flex-col justify-between p-3.5 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">Time Taken</span>
              <span className="material-symbols-outlined text-[18px] text-secondary">timer</span>
            </div>
            <div className="mt-2">
              <div className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
                {data.timeEfficiency.totalTime || '11m 42s'}
              </div>
              <div className="flex items-center gap-1 mt-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px] text-secondary">speed</span>
                <span className="font-label-sm text-label-sm">{data.timeEfficiency.avgPerQuestion} / Q · {data.timeEfficiency.label}</span>
              </div>
            </div>
          </div>

          {/* Stat 3: Adaptive Difficulty */}
          <div className="flex flex-col justify-between p-3.5 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">Adaptive Level</span>
              <span className="material-symbols-outlined text-[18px] text-primary">auto_graph</span>
            </div>
            <div className="mt-2">
              <div className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
                {data.adaptiveLevel.current} <span className="font-label-sm text-label-sm text-on-surface-variant">/ {data.adaptiveLevel.max}</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-on-surface-variant">
                <span className="material-symbols-outlined text-[14px] text-primary">military_tech</span>
                <span className="font-label-sm text-label-sm">{data.adaptiveLevel.note}</span>
              </div>
            </div>
          </div>

          {/* Stat 4: Memory Decay / FSRS */}
          <div className="flex flex-col justify-between p-3.5 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface-variant">FSRS Retention</span>
              <span className="material-symbols-outlined text-[18px] text-on-tertiary-container">psychology</span>
            </div>
            <div className="mt-2">
              <div className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
                {data.fsrsRetention.days} Days
              </div>
              <div className="flex items-center gap-1 mt-1 text-on-tertiary-container">
                <span className="material-symbols-outlined text-[14px]">event_repeat</span>
                <span className="font-label-sm text-label-sm font-semibold">{data.fsrsRetention.note}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Topic & Concept Diagnostic */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Topic Breakdown &amp; Mastery Shifts
            </h3>
            <span className="font-label-sm text-label-sm text-secondary font-semibold">
              {data.topicBreakdown.length} Micro-Concepts
            </span>
          </div>

          <div className="flex flex-col space-y-2.5">
            {data.topicBreakdown.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-surface-container-lowest shadow-sm space-y-2 border border-outline-variant/30">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        item.status === 'mastered' ? 'bg-on-tertiary-container' : 'bg-secondary'
                      }`}
                    />
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      {item.name}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm shrink-0 font-medium ${
                      item.status === 'mastered'
                        ? 'bg-tertiary-fixed/30 text-on-tertiary-container'
                        : 'bg-secondary-fixed/50 text-secondary'
                    }`}
                  >
                    {item.score}
                  </span>
                </div>

                <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-700 ${
                      item.status === 'mastered' ? 'bg-on-tertiary-container' : 'bg-secondary-container'
                    }`}
                    style={{ width: `${item.mastery}%` }}
                  />
                </div>

                {item.status === 'mastered' ? (
                  <div className="flex justify-between items-center text-on-surface-variant font-body-sm text-body-sm">
                    <span>
                      Mastery level: <strong className="text-on-surface">{item.mastery}%</strong>
                    </span>
                    <span className="text-on-tertiary-container font-label-sm text-label-sm font-semibold">
                      {item.shift}
                    </span>
                  </div>
                ) : (
                  <div
                    className={`flex items-center gap-1.5 p-2 rounded-lg text-on-surface ${
                      item.warning ? 'bg-secondary-fixed/30 text-secondary' : 'bg-surface-container-low'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">
                      {item.warning ? 'tips_and_updates' : 'info'}
                    </span>
                    <span className="font-body-sm text-body-sm leading-tight text-on-surface-variant">
                      {item.warning || item.tip}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Intelligent Next Actions Section */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-secondary">psychology_alt</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Growly Copilot Recommends
              </h3>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Ranked by Impact</span>
          </div>

          {/* Action Card 1: High Priority AI Tutor Review */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest to-secondary-fixed/20 p-4 shadow-sm flex flex-col space-y-3 border border-outline-variant/30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary-container text-[20px]">smart_toy</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    Walkthrough Missed Questions
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">
                    High Impact
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
                  Engage in a 3-minute Socratic breakdown for Question 4 (Starvation) &amp; Question 9 (Havender's).
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/tutor?mode=explain&topic=Deadlocks%20Missed%20Questions')}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-secondary-container text-on-secondary-container font-label-md text-label-md font-bold hover:opacity-95 active:scale-[0.98] transition-all"
              type="button"
            >
              <span>Start Focused AI Review</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Action Card 2: Generate Flashcards */}
          <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between gap-3 border border-outline-variant/30">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-on-surface">
                <span className="material-symbols-outlined text-[20px]">style</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                  Generate 6 Precision Flashcards
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  {cardsCreated ? 'Added to Unit 3 Spaced Repetition deck! Opening...' : 'Auto-added to Unit 3 Spaced Repetition deck'}
                </span>
              </div>
            </div>
            <button
              onClick={handleCreateCards}
              disabled={cardsCreated}
              className={`shrink-0 px-3 py-2 rounded-xl font-label-md text-label-md transition-all ${
                cardsCreated
                  ? 'bg-on-tertiary-container text-surface-container-lowest'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface active:scale-95'
              }`}
              type="button"
            >
              {cardsCreated ? 'Created ✓' : 'Create Cards'}
            </button>
          </div>

          {/* Action Card 3: Spaced Re-test Scheduling */}
          <div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between gap-3 border border-outline-variant/30">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0 text-on-surface">
                <span className="material-symbols-outlined text-[20px]">calendar_clock</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                  Spaced Calibration Test
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  {scheduled ? 'Scheduled: Thursday at 4:00 PM (Reminder set)' : 'Algorithm recommends: Thursday, 4:00 PM'}
                </span>
              </div>
            </div>
            <button
              onClick={handleSchedule}
              className={`shrink-0 px-3 py-2 rounded-xl font-label-md text-label-md transition-all ${
                scheduled
                  ? 'bg-secondary-fixed text-on-secondary-fixed font-bold'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface active:scale-95'
              }`}
              type="button"
            >
              {scheduled ? 'Scheduled ✓' : 'Schedule'}
            </button>
          </div>
        </div>

        {/* Bottom Final Action Hub */}
        <div className="flex flex-col space-y-2 pt-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-sm active:scale-[0.98] transition-all hover:bg-surface-tint"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span>Return to Dashboard</span>
          </button>
          <button
            onClick={() => setShowReviewModal(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-surface-container-lowest text-on-surface font-label-md text-label-md hover:bg-surface-container border border-outline-variant/30 active:scale-[0.98] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant">list_alt</span>
            <span>Review All 15 Explanations (Step-by-Step)</span>
          </button>
        </div>

        {/* Question Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4">
            <div className="bg-surface-container-lowest w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-xl flex flex-col overflow-hidden border border-outline-variant/30">
              <div className="flex items-center justify-between p-4 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[22px]">fact_check</span>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Step-by-Step Question Review
                  </h3>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {data.questionReview.map((q) => (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      q.correct
                        ? 'border-surface-container-high bg-surface-container-lowest'
                        : 'border-error/40 bg-error-container/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            q.correct
                              ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                              : 'bg-error-container text-on-error-container'
                          }`}
                        >
                          {q.id}
                        </span>
                        <span className="font-label-md text-label-md font-semibold text-on-surface">
                          {q.topic}
                        </span>
                      </div>
                      <span
                        className={`font-label-sm text-label-sm font-bold px-2 py-0.5 rounded-md ${
                          q.correct
                            ? 'bg-on-tertiary-container/10 text-on-tertiary-container'
                            : 'bg-error-container text-error'
                        }`}
                      >
                        {q.correct ? 'Correct' : 'Needs Review'}
                      </span>
                    </div>

                    <div className="mt-2 text-body-sm flex items-center gap-4 text-on-surface-variant">
                      <span>
                        Your answer:{' '}
                        <strong className={q.correct ? 'text-on-tertiary-container' : 'text-error'}>
                          {q.yourAnswer}
                        </strong>
                      </span>
                      {!q.correct && (
                        <span>
                          Correct answer:{' '}
                          <strong className="text-on-tertiary-container">{q.answer}</strong>
                        </span>
                      )}
                      {q.time && <span>Time: {q.time}</span>}
                    </div>

                    {q.explanation && (
                      <p className="mt-2 text-body-sm text-on-surface-variant bg-surface-container-low p-2.5 rounded-lg leading-relaxed">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-surface-container bg-surface-container-low flex justify-end">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 bg-primary text-on-primary font-label-md rounded-xl font-semibold active:scale-95 transition-all"
                >
                  Close Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
