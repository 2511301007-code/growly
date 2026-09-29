import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTodayRevision, completeRevisionTask } from '../services/api';

const FALLBACK_SUMMARY = {
  totalItems: 28,
  estimatedTime: '~35 mins',
  retention: 84,
  criticalTopics: 3,
};

const FALLBACK_TASKS = [
  {
    id: 'rev-1',
    priority: 'high',
    course: 'Operating Systems',
    title: "Deadlocks — Banker's Algorithm & Resource Allocation",
    duration: '15 mins',
    type: '15 Questions (Adaptive Quiz)',
    reasoning: '52% accuracy on last quiz • Exam in 4 days • Memory decay threshold reached',
    scoreBoost: '+9% est. score boost',
    actionText: 'Start Revision Now',
    actionRoute: '/quiz',
    completed: false,
  },
  {
    id: 'rev-2',
    priority: 'medium',
    course: 'Operating Systems',
    title: 'CPU Scheduling Algorithms (SJF, Round Robin)',
    duration: '8 mins',
    type: '10 Spaced Repetition Flashcards',
    reasoning: 'Scheduled by SRS algorithm (Optimal retrieval interval: 3 days)',
    lastReviewed: 'Last reviewed 3d ago',
    actionText: 'Review Cards',
    actionRoute: '/flashcards',
    completed: false,
  },
  {
    id: 'rev-3',
    priority: 'quick',
    course: 'Operating Systems',
    title: 'Process States & Transitions Diagram',
    duration: '5 mins',
    type: 'Micro-recap & Concept Summary',
    reasoning: 'Reinforce mental model before progressing to Inter-process Communication (IPC).',
    badge: 'Visual map included',
    actionText: 'Quick Recap',
    actionRoute: '/tutor?mode=explain&topic=Process%20States%20and%20Transitions',
    completed: false,
  },
  {
    id: 'rev-4',
    priority: 'maintenance',
    course: 'Database Eng',
    title: 'SQL Indexing & B-Trees',
    duration: '4 mins',
    type: '8 Flashcards • 4 mins',
    completed: false,
  },
];

export default function SmartRevision() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(FALLBACK_SUMMARY);
  const [tasks, setTasks] = useState(FALLBACK_TASKS);
  const [filter, setFilter] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  useEffect(() => {
    getTodayRevision()
      .then((data) => {
        if (data.summary) setSummary(data.summary);
        if (data.tasks && data.tasks.length > 0) {
          // Merge API tasks with rich metadata
          setTasks((prev) =>
            prev.map((t) => {
              const apiTask = data.tasks.find((at) => at.id === t.id);
              return apiTask ? { ...t, completed: apiTask.completed } : t;
            })
          );
        }
      })
      .catch(() => {
        // Fallback already set
      });
  }, []);

  const handleStartSession = () => {
    setSessionLoading(true);
    setTimeout(() => {
      setSessionLoading(false);
      setSessionReady(true);
      setTimeout(() => {
        navigate('/quiz');
      }, 900);
    }, 800);
  };

  const handleToggleTask = async (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    try {
      await completeRevisionTask(id);
    } catch {
      // Offline fallback state kept
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'high') return t.priority === 'high';
    if (filter === 'medium') return t.priority === 'medium';
    if (filter === 'quick') return t.priority === 'quick' || t.priority === 'maintenance';
    return true;
  });

  return (
    <div className="flex flex-col relative w-full px-gutter-mobile space-y-space-md max-w-4xl mx-auto">
      {/* Header Title Section */}
      <div className="flex flex-col pt-space-sm">
        <div className="flex items-center gap-1.5 mb-1 text-secondary">
          <span className="material-symbols-outlined text-[18px]">psychology</span>
          <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
            Adaptive Spaced Memory
          </span>
        </div>
        <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface font-bold tracking-tight">
          What should I study today?
        </h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
          AI-generated adaptive revision plan calibrated to your forgetting curves and upcoming exams.
        </p>
      </div>

      {/* Top Summary Statistics Bento Bar */}
      <div className="grid grid-cols-3 gap-2.5 bg-surface-container-lowest p-space-sm rounded-xl shadow-[0_1px_3px_rgba(15,23,42,0.04),0_1px_2px_rgba(15,23,42,0.03)] border border-outline-variant/30">
        {/* Stat 1: Total Load */}
        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-container-low text-center">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Revision Load</span>
          <div className="flex items-baseline gap-0.5 mt-0.5">
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
              {summary.totalItems}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">items</span>
          </div>
          <span className="font-label-sm text-label-sm text-secondary font-semibold mt-0.5">
            {summary.estimatedTime}
          </span>
        </div>

        {/* Stat 2: Retention */}
        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-container-low text-center relative overflow-hidden">
          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">Retention</span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="font-headline-sm text-headline-sm font-bold text-on-tertiary-container">
              {summary.retention}%
            </span>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-on-tertiary-container h-full rounded-full transition-all duration-700"
              style={{ width: `${summary.retention}%` }}
            />
          </div>
        </div>

        {/* Stat 3: Urgent Topics */}
        <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-error-container/40 text-center">
          <span className="font-label-sm text-label-sm text-error font-medium">Critical Topics</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-headline-sm text-headline-sm font-bold text-error">
              {summary.criticalTopics}
            </span>
            <span className="font-label-sm text-label-sm text-error font-medium">urgent</span>
          </div>
          <span className="font-label-sm text-label-sm text-on-error-container font-semibold mt-0.5">
            Focus now
          </span>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between pt-1 relative">
        <div className="flex items-center gap-2">
          <span className="font-label-lg text-label-lg text-on-surface font-bold">Daily Priority Deck</span>
          <span className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-full font-code-sm text-code-sm font-semibold">
            {filteredTasks.length} Tasks
          </span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm px-2.5 py-1 rounded-lg bg-surface-container-low"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span className="capitalize">{filter === 'all' ? 'Filter' : filter}</span>
          </button>
          {showFilterMenu && (
            <div className="absolute right-0 top-8 z-30 bg-surface-container-lowest shadow-lg rounded-xl border border-outline-variant/30 py-1 min-w-[140px]">
              {['all', 'high', 'medium', 'quick'].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFilter(f);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold capitalize hover:bg-surface-container ${
                    filter === f ? 'text-secondary font-bold' : 'text-on-surface-variant'
                  }`}
                >
                  {f === 'all' ? 'All Priorities' : `${f} Priority`}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Plan Cards List */}
      <div className="space-y-space-md">
        {filteredTasks.map((t) => {
          if (t.priority === 'high') {
            return (
              <div
                key={t.id}
                className={`relative bg-surface-container-lowest rounded-xl p-space-md shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition-all overflow-hidden border border-outline-variant/30 ${
                  t.completed ? 'opacity-60 bg-surface-container-low' : ''
                }`}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-error" />
                <div className="flex items-start justify-between gap-2 pl-1.5">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 bg-error-container text-on-error-container font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                        High Priority
                      </span>
                      <span className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full font-medium">
                        {t.course}
                      </span>
                    </div>
                    <h2
                      className={`font-headline-sm text-headline-sm text-on-surface font-bold leading-snug ${
                        t.completed ? 'line-through text-on-surface-variant' : ''
                      }`}
                    >
                      {t.title}
                    </h2>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="font-label-sm text-label-sm font-semibold text-error bg-error-container/50 px-2 py-0.5 rounded-md">
                      {t.duration}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm mt-2 pl-1.5">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">quiz</span>
                    <span>{t.type}</span>
                  </div>
                </div>

                <div className="mt-space-sm pl-1.5 bg-error-container/20 rounded-lg p-2.5 flex items-start gap-2">
                  <span className="material-symbols-outlined text-error text-[18px] flex-shrink-0 mt-0.5">
                    warning
                  </span>
                  <p className="font-body-sm text-body-sm text-on-error-container leading-tight">
                    <strong className="font-semibold">52% accuracy on last quiz</strong> • Exam in 4 days •
                    Memory decay threshold reached
                  </p>
                </div>

                <div className="mt-space-md pl-1.5 flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px] text-on-tertiary-container">
                      trending_up
                    </span>
                    <span>{t.scoreBoost}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleTask(t.id)}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface"
                      type="button"
                    >
                      {t.completed ? 'Mark Undone' : 'Mark Done'}
                    </button>
                    <button
                      onClick={() => navigate(t.actionRoute)}
                      className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-surface-tint active:scale-95 transition-all flex items-center gap-1.5 shadow-sm font-semibold"
                      type="button"
                    >
                      <span>{t.actionText}</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          if (t.priority === 'medium') {
            return (
              <div
                key={t.id}
                className={`relative bg-surface-container-lowest rounded-xl p-space-md shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition-all overflow-hidden border border-outline-variant/30 ${
                  t.completed ? 'opacity-60 bg-surface-container-low' : ''
                }`}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary-container" />
                <div className="flex items-start justify-between gap-2 pl-1.5">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        Medium Priority
                      </span>
                      <span className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full font-medium">
                        {t.course}
                      </span>
                    </div>
                    <h2
                      className={`font-headline-sm text-headline-sm text-on-surface font-bold leading-snug ${
                        t.completed ? 'line-through text-on-surface-variant' : ''
                      }`}
                    >
                      {t.title}
                    </h2>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="font-label-sm text-label-sm font-semibold text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded-md">
                      {t.duration}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm mt-2 pl-1.5">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">style</span>
                    <span>{t.type}</span>
                  </div>
                </div>

                <div className="mt-space-sm pl-1.5 bg-secondary-fixed/30 rounded-lg p-2.5 flex items-start gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px] flex-shrink-0 mt-0.5">
                    calendar_month
                  </span>
                  <p className="font-body-sm text-body-sm text-on-secondary-container leading-tight">
                    {t.reasoning}
                  </p>
                </div>

                <div className="mt-space-md pl-1.5 flex items-center justify-between pt-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {t.lastReviewed}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleTask(t.id)}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface"
                      type="button"
                    >
                      {t.completed ? 'Mark Undone' : 'Mark Done'}
                    </button>
                    <button
                      onClick={() => navigate(t.actionRoute)}
                      className="bg-surface-container-high text-on-surface font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-surface-variant active:scale-95 transition-all flex items-center gap-1.5 font-semibold"
                      type="button"
                    >
                      <span>{t.actionText}</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          if (t.priority === 'quick') {
            return (
              <div
                key={t.id}
                className={`relative bg-surface-container-lowest rounded-xl p-space-md shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)] transition-all overflow-hidden border border-outline-variant/30 ${
                  t.completed ? 'opacity-60 bg-surface-container-low' : ''
                }`}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-on-tertiary-container" />
                <div className="flex items-start justify-between gap-2 pl-1.5">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="inline-flex items-center gap-1 bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container" />
                        Quick Review
                      </span>
                      <span className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full font-medium">
                        {t.course}
                      </span>
                    </div>
                    <h2
                      className={`font-headline-sm text-headline-sm text-on-surface font-bold leading-snug ${
                        t.completed ? 'line-through text-on-surface-variant' : ''
                      }`}
                    >
                      {t.title}
                    </h2>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className="font-label-sm text-label-sm font-semibold text-on-tertiary-container bg-tertiary-fixed/40 px-2 py-0.5 rounded-md">
                      {t.duration}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm mt-2 pl-1.5">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-on-tertiary-container">
                      schema
                    </span>
                    <span>{t.type}</span>
                  </div>
                </div>

                <div className="mt-space-sm pl-1.5 bg-tertiary-fixed/20 rounded-lg p-2.5 flex items-start gap-2">
                  <span className="material-symbols-outlined text-on-tertiary-container text-[18px] flex-shrink-0 mt-0.5">
                    tips_and_updates
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface leading-tight">
                    {t.reasoning}
                  </p>
                </div>

                <div className="mt-space-md pl-1.5 flex items-center justify-between pt-1">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{t.badge}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleTask(t.id)}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface"
                      type="button"
                    >
                      {t.completed ? 'Mark Undone' : 'Mark Done'}
                    </button>
                    <button
                      onClick={() => navigate(t.actionRoute)}
                      className="bg-surface-container-high text-on-surface font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-surface-variant active:scale-95 transition-all flex items-center gap-1.5 font-semibold"
                      type="button"
                    >
                      <span>{t.actionText}</span>
                      <span className="material-symbols-outlined text-[16px]">menu_book</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          // Maintenance Card
          return (
            <div
              key={t.id}
              className={`bg-surface-container-lowest rounded-xl p-space-md shadow-[0_1px_3px_rgba(15,23,42,0.04)] flex items-center justify-between gap-3 border border-outline-variant/30 ${
                t.completed ? 'opacity-60 bg-surface-container-low' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center flex-shrink-0 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">database</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                      Maintenance
                    </span>
                    <span className="text-outline-variant font-label-sm text-label-sm">•</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                      {t.course}
                    </span>
                  </div>
                  <span
                    className={`font-label-lg text-label-lg text-on-surface font-semibold truncate ${
                      t.completed ? 'line-through text-on-surface-variant' : ''
                    }`}
                  >
                    {t.title}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{t.type}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleTask(t.id)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    t.completed
                      ? 'bg-on-tertiary-container text-white'
                      : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface'
                  }`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {t.completed ? 'check' : 'play_arrow'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Insight Strategic Callout Card */}
      <div className="bg-gradient-to-br from-secondary-fixed/40 via-surface-container-lowest to-surface-container-lowest p-space-md rounded-xl shadow-[0_0_0_1px_rgba(245,158,11,0.25),0_8px_24px_-4px_rgba(245,158,11,0.08)] relative overflow-hidden border border-secondary-fixed">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-secondary-container/20 flex items-center justify-center flex-shrink-0 text-secondary mt-0.5">
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-1">
              <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                Growly Strategy Engine
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface leading-relaxed">
              Spending <span className="font-semibold text-on-surface">15 minutes on Deadlocks</span> today will boost your estimated exam score from{' '}
              <span className="font-bold text-error">74%</span> to{' '}
              <span className="font-bold text-on-tertiary-container">83%</span> based on historical cohort patterns.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA Actions */}
      <div className="flex flex-col space-y-2 pt-space-xs pb-space-sm">
        <button
          onClick={handleStartSession}
          disabled={sessionLoading}
          className="w-full bg-primary-container text-on-primary font-label-lg text-label-lg py-3.5 px-4 rounded-xl shadow-md hover:bg-primary active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          type="button"
        >
          {sessionLoading ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
              <span>Preparing Session Deck...</span>
            </>
          ) : sessionReady ? (
            <>
              <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">check_circle</span>
              <span>Session Ready! Launching...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px] text-secondary-container">play_circle</span>
              <span className="font-bold">Start Full Session (35 mins)</span>
            </>
          )}
        </button>
        <button
          onClick={() => setShowCustomizeModal(true)}
          className="w-full bg-surface-container-low text-on-surface font-label-md text-label-md py-2.5 px-4 rounded-xl hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/30 font-semibold"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span>Customize Plan &amp; Topics</span>
        </button>
      </div>

      {/* Customize Modal */}
      {showCustomizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-xl p-5 border border-outline-variant/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-sm font-bold text-on-surface">Customize Study Plan</h3>
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="text-body-sm text-on-surface-variant">
              Toggle topics to dynamically recalibrate your daily revision load and focus distribution.
            </p>
            <div className="space-y-2">
              {['Deadlocks & Banker Algo', 'CPU Scheduling', 'Process States & Transitions', 'SQL Indexing & B-Trees'].map((topic, i) => (
                <label key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors">
                  <span className="font-label-md text-on-surface font-medium">{topic}</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-secondary rounded" />
                </label>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCustomizeModal(false)}
                className="flex-1 py-2 rounded-xl bg-primary text-on-primary font-label-md font-bold"
              >
                Apply &amp; Recalibrate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
