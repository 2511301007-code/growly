import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudent } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getStudent()
      .then(setStudent)
      .catch(() => {
        /* use fallback data on error */
        setStudent({
          name: 'Aryan',
          streak: 12,
          studyTime: { today: '2h 15m', goal: '3h', percent: 75 },
          questions: { solved: 48, total: 60, today: 14 },
          mastery: { percent: 82, weeklyGain: 4 },
          courses: [
            { code: 'CS 301', name: 'Operating Systems', desc: 'Paging, TLB Translation & Virtual Memory models.', progress: 76, next: 'Memory', color: 'primary' },
            { code: 'CS 304', name: 'Database Systems', desc: 'Normalization 3NF, BCNF & B+ Tree indices storage.', progress: 88, next: 'Normalization', color: 'on-tertiary-container' },
            { code: 'CS 307', name: 'Computer Networks', desc: 'TCP 3-way Handshake, Sliding Window, and Congestion.', progress: 64, next: 'TCP Handshake', color: 'secondary' },
          ],
        });
      });
  }, []);

  if (!student) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const s = student;

  return (
    <div className="flex flex-col w-full">
      {/* ── Greeting ─────────────────────────────────────────────────────── */}
      <div className="px-gutter-mobile pt-space-md pb-space-xs flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface tracking-tight">
              Good morning, {s.name} 👋
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Here's what your learning looks like today.
            </p>
          </div>
          <button
            aria-label="Quick focus timer"
            className="w-10 h-10 rounded-full bg-secondary-fixed/40 flex items-center justify-center text-on-secondary-container transition-transform active:scale-95 shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              timer
            </span>
          </button>
        </div>
      </div>

      {/* ── Bento Stats Grid ─────────────────────────────────────────────── */}
      <div className="px-gutter-mobile mt-space-md grid grid-cols-2 gap-space-sm">
        {/* Study Time */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Study Time</span>
            <svg className="w-7 h-7 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-surface-container"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="text-secondary-container"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${s.studyTime.percent}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
          </div>
          <div className="mt-space-sm">
            <span className="font-headline-md text-headline-md text-on-surface tracking-tight leading-none block">
              {s.studyTime.today}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-1 block">
              Goal: {s.studyTime.goal} ({s.studyTime.percent}%)
            </span>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Current Streak</span>
            <span
              className="material-symbols-outlined text-secondary text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
          </div>
          <div className="mt-space-sm">
            <div className="flex items-baseline gap-1">
              <span className="font-headline-md text-headline-md text-on-surface tracking-tight leading-none">
                {s.streak}
              </span>
              <span className="font-label-md text-label-md text-secondary font-bold">Days</span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary mt-1 block font-medium">
              🔥 Personal best!
            </span>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Questions</span>
            <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">fact_check</span>
          </div>
          <div className="mt-space-sm">
            <span className="font-headline-md text-headline-md text-on-surface tracking-tight leading-none block">
              {s.questions.solved}{' '}
              <span className="text-on-surface-variant font-body-sm text-body-sm font-normal">
                / {s.questions.total}
              </span>
            </span>
            <span className="font-label-sm text-label-sm text-on-tertiary-container mt-1 block font-medium">
              +{s.questions.today} today
            </span>
          </div>
        </div>

        {/* Mastery */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Overall Mastery</span>
            <span className="material-symbols-outlined text-primary text-[20px]">workspace_premium</span>
          </div>
          <div className="mt-space-sm">
            <span className="font-headline-md text-headline-md text-on-surface tracking-tight leading-none block">
              {s.mastery.percent}%
            </span>
            <span className="font-label-sm text-label-sm text-on-tertiary-container mt-1 flex items-center gap-0.5 font-medium">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> {s.mastery.weeklyGain}% this
              week
            </span>
          </div>
        </div>
      </div>

      {/* ── Urgent Midterm Card ──────────────────────────────────────────── */}
      <div className="px-gutter-mobile mt-space-md">
        <div className="bg-gradient-to-r from-primary-container to-[#1a233b] text-on-primary rounded-xl p-space-md shadow-md relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-secondary-container/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-space-xs">
            <div className="flex items-center gap-1.5 bg-surface-container-lowest/15 backdrop-blur-md px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-secondary-fixed text-[14px]">alarm</span>
              <span className="font-label-sm text-label-sm text-surface-bright tracking-wide uppercase">
                Urgent Review
              </span>
            </div>
            <div className="flex items-center gap-1 text-secondary-fixed">
              <span className="material-symbols-outlined text-[15px]">event</span>
              <span className="font-label-sm text-label-sm font-bold">4 days left</span>
            </div>
          </div>
          <div className="mt-1 flex flex-col">
            <span className="font-headline-sm text-headline-sm text-surface-bright font-bold">
              Operating Systems Midterm
            </span>
            <div className="flex items-center justify-between mt-2">
              <span className="font-body-sm text-body-sm text-primary-fixed-dim">Preparedness Readiness</span>
              <span className="font-label-md text-label-md font-bold text-surface-bright">78%</span>
            </div>
            <div className="w-full bg-surface-container-lowest/20 h-2 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-secondary-container h-full rounded-full transition-all duration-700" style={{ width: '78%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Spaced Repetition Suggestions ────────────────────────────────── */}
      <div className="px-gutter-mobile mt-space-lg">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-secondary-fixed/50 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface leading-snug">
                  What should I study today?
                </h2>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  Spaced repetition algorithmic suggestions
                </p>
              </div>
            </div>
          </div>

          <div className="mt-space-md flex flex-col gap-space-xs">
            {/* Critical */}
            <div className="bg-error-container/30 p-2.5 rounded-lg flex items-start gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-error mt-1 flex-shrink-0 animate-pulse" />
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface truncate">
                    Deadlocks (Operating Systems)
                  </span>
                  <span className="font-label-sm text-label-sm text-error font-semibold flex-shrink-0">15 Qs</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Low accuracy (54%) · Midterm in 4 days
                </p>
              </div>
            </div>
            {/* Medium */}
            <div className="bg-secondary-fixed/30 p-2.5 rounded-lg flex items-start gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary mt-1 flex-shrink-0" />
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface truncate">
                    CPU Scheduling Algorithms
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary font-semibold flex-shrink-0">
                    10 cards
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Due for memory consolidation review
                </p>
              </div>
            </div>
            {/* Steady */}
            <div className="bg-surface-container-low p-2.5 rounded-lg flex items-start gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container mt-1 flex-shrink-0" />
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface truncate">
                    Process States &amp; PCB
                  </span>
                  <span className="font-label-sm text-label-sm text-on-tertiary-container font-semibold flex-shrink-0">
                    5m recap
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Confidence steady (92%) · Quick refresher
                </p>
              </div>
            </div>
          </div>

          <div className="mt-space-md">
            <button
              onClick={() => navigate('/revision')}
              className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform relative overflow-hidden"
            >
              <span
                className="material-symbols-outlined text-[20px] text-secondary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                play_circle
              </span>
              <span>Start Daily Revision (25m)</span>
              <span className="absolute right-4 w-2 h-2 rounded-full bg-secondary-container animate-ping" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Continue Learning ────────────────────────────────────────────── */}
      <div className="mt-space-lg">
        <div className="px-gutter-mobile flex items-center justify-between mb-space-sm">
          <div className="flex items-center gap-1.5">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Continue Learning</h2>
            <span className="font-label-sm text-label-sm bg-surface-container-high px-2 py-0.5 rounded-full text-on-surface-variant">
              {s.courses?.length || 3} Active
            </span>
          </div>
          <button className="font-label-md text-label-md text-secondary hover:underline flex items-center">
            See All
          </button>
        </div>

        <div className="flex gap-space-sm overflow-x-auto px-gutter-mobile pb-space-xs no-scrollbar">
          {(s.courses || []).map((course, i) => (
            <div
              key={i}
              className="min-w-[260px] max-w-[260px] bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between flex-shrink-0"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold ${
                      i === 0
                        ? 'bg-secondary-fixed/50 text-on-secondary-container'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {course.code}
                  </span>
                  <span
                    className={`font-label-sm text-label-sm font-semibold ${
                      course.color === 'on-tertiary-container'
                        ? 'text-on-tertiary-container'
                        : 'text-on-surface'
                    }`}
                  >
                    {course.progress}%
                  </span>
                </div>
                <h3 className="font-label-lg text-label-lg text-on-surface line-clamp-1">{course.name}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">{course.desc}</p>
              </div>
              <div className="mt-space-md pt-space-xs">
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mb-space-sm">
                  <div
                    className={`bg-${course.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <button className="w-full bg-surface-container-low hover:bg-surface-container text-on-surface py-2 rounded-lg font-label-sm text-label-sm flex items-center justify-center gap-1 transition-colors">
                  <span>Continue → {course.next}</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Weekly Study Velocity ────────────────────────────────────────── */}
      <div className="px-gutter-mobile mt-space-lg">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-space-sm">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Weekly Study Velocity</h2>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Avg. 2.6 hrs/day · Target: 3.0 hrs
              </p>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-md">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-label-sm text-label-sm text-on-surface">Target Line</span>
            </div>
          </div>

          <div className="w-full mt-space-md">
            <div className="flex items-end justify-between h-32 pt-4 pb-2 px-1 relative">
              <div className="absolute inset-x-0 top-10 border-b border-dashed border-outline-variant/60 pointer-events-none flex justify-end">
                <span className="font-code-sm text-code-sm text-on-surface-variant -mt-4 bg-surface-container-lowest px-1">
                  3.0h target
                </span>
              </div>
              {[
                { day: 'M', h: 20, active: false },
                { day: 'T', h: 24, active: false },
                { day: 'W', h: 16, active: false },
                { day: 'T', h: 28, active: false },
                { day: 'F', h: 22, active: false },
                { day: 'Today', h: 24, active: true },
                { day: 'S', h: 4, active: false },
              ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 z-10">
                  <div
                    className={`w-7 rounded-t-md transition-all group relative ${
                      bar.active
                        ? 'bg-primary'
                        : bar.h < 6
                        ? 'bg-surface-container'
                        : 'bg-surface-container-high hover:bg-primary'
                    }`}
                    style={{ height: `${bar.h * 4}px` }}
                  >
                    {bar.active && (
                      <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-primary text-on-primary text-[10px] py-0.5 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        2h 15m
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-label-sm text-label-sm ${
                      bar.active ? 'text-on-surface font-bold' : 'text-on-surface-variant'
                    }`}
                  >
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Weak Topics ──────────────────────────────────────────────────── */}
      <div className="px-gutter-mobile mt-space-lg mb-space-md">
        <div className="flex items-center justify-between mb-space-sm">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[20px]">warning</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Weak Topics · Targeted Focus
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-space-sm">
          {[
            { name: 'Thermodynamics (Cycle Laws)', mastery: 48, color: 'error', action: 'Practice Quiz' },
            { name: 'Transactions & Concurrency', mastery: 63, color: 'secondary', action: 'Ask AI Tutor', ai: true },
            { name: 'Memory Management & Segmentation', mastery: 69, color: 'on-tertiary-container', action: 'Review Cards' },
          ].map((topic, i) => (
            <div
              key={i}
              className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center justify-between"
            >
              <div className="flex flex-col min-w-0 pr-2">
                <span className="font-label-lg text-label-lg text-on-surface truncate">{topic.name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`bg-${topic.color} h-full rounded-full`}
                      style={{ width: `${topic.mastery}%` }}
                    />
                  </div>
                  <span className={`font-label-sm text-label-sm text-${topic.color} font-medium`}>
                    {topic.mastery}% Mastery
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (topic.ai) navigate('/tutor');
                  else if (topic.action === 'Practice Quiz') navigate('/quiz');
                  else navigate('/flashcards');
                }}
                className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-semibold flex-shrink-0 transition-colors flex items-center gap-1 ${
                  i === 0
                    ? 'bg-secondary-fixed/50 hover:bg-secondary-fixed text-on-secondary-container'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                }`}
              >
                {topic.ai && (
                  <span className="material-symbols-outlined text-[16px] text-secondary">auto_awesome</span>
                )}
                <span>{topic.action}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Growly Omnibar ────────────────────────────────────────────────── */}
      <div className="px-gutter-mobile my-space-sm">
        <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm flex items-center gap-space-sm">
          <div className="w-9 h-9 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">psychology</span>
          </div>
          <input
            className="w-full bg-transparent border-none outline-none font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant"
            placeholder="Ask Growly anything... (e.g. explain Semaphore)"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) navigate('/tutor');
            }}
          />
          <button
            aria-label="Submit query"
            onClick={() => query.trim() && navigate('/tutor')}
            className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center flex-shrink-0 transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
