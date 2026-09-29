import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveQuiz, submitQuizAnswer } from '../services/api';

const FALLBACK_QUIZ = {
  level: 3,
  levelLabel: 'Advanced',
  totalQuestions: 15,
  currentIndex: 6,
  timeLimit: 900,
  question: {
    id: 'q7',
    text: 'Given the following resource allocation state, determine whether the system is in a safe state using the Banker\'s algorithm.',
    matrix: {
      headers: ['Proc', 'Alloc (A B C)', 'Max (A B C)', 'Need (A B C)'],
      rows: [
        ['P₀', '0  1  0', '7  5  3', '7  4  3'],
        ['P₁', '2  0  0', '3  2  2', '1  2  2'],
        ['P₂', '3  0  2', '9  0  2', '6  0  0'],
        ['P₃', '2  1  1', '2  2  2', '0  1  1'],
        ['P₄', '0  0  2', '4  3  3', '4  3  1'],
      ],
      available: '3  3  2',
    },
    options: [
      { id: 'a', text: 'Safe — Sequence ⟨P₁, P₃, P₄, P₂, P₀⟩ exists', correct: true },
      { id: 'b', text: 'Unsafe — No valid sequence exists', correct: false },
      { id: 'c', text: 'Safe — Sequence ⟨P₀, P₁, P₂, P₃, P₄⟩ exists', correct: false },
      { id: 'd', text: 'Cannot determine — Insufficient data', correct: false },
    ],
  },
};

export default function PracticeQuiz() {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [timer, setTimer] = useState(900);
  const [paused, setPaused] = useState(false);
  const [answeredSteps, setAnsweredSteps] = useState([true, true, true, true, true, true, false, false, false, false, false, false, false, false, false]);
  const intervalRef = useRef(null);

  useEffect(() => {
    getActiveQuiz()
      .then((d) => {
        setQuiz(d);
        setTimer(d.timeLimit || 900);
      })
      .catch(() => {
        setQuiz(FALLBACK_QUIZ);
      });
  }, []);

  // Timer logic
  useEffect(() => {
    if (paused || submitted) return;
    intervalRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 0) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [paused, submitted]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitted(true);
    const correct = quiz.question.options.find((o) => o.id === selected)?.correct;
    setFeedback({ correct });
    const newSteps = [...answeredSteps];
    newSteps[quiz.currentIndex] = true;
    setAnsweredSteps(newSteps);
    try {
      await submitQuizAnswer(quiz.question.id, selected);
    } catch {
      // Backend may not be running
    }
  };

  if (!quiz) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const q = quiz.question;

  return (
    <div className="flex flex-col w-full">
      {/* ── Header Info Bar ──────────────────────────────────────────────── */}
      <div className="px-gutter-mobile pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-primary-container text-on-primary-container px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-[14px] text-secondary-container">bolt</span>
            <span className="font-label-sm text-label-sm font-bold">Level {quiz.level} · {quiz.levelLabel}</span>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Q{quiz.currentIndex + 1}/{quiz.totalQuestions}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPaused((p) => !p)}
            className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">{paused ? 'play_arrow' : 'pause'}</span>
          </button>
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-label-md text-label-md font-bold ${
            timer < 60 ? 'bg-error-container/50 text-error' : 'bg-surface-container-low text-on-surface'
          }`}>
            <span className="material-symbols-outlined text-[16px]">timer</span>
            <span>{formatTime(timer)}</span>
          </div>
        </div>
      </div>

      {/* ── Step Progress Bar ────────────────────────────────────────────── */}
      <div className="px-gutter-mobile pb-2">
        <div className="flex items-center gap-1">
          {answeredSteps.map((done, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i === quiz.currentIndex
                  ? 'bg-secondary-container'
                  : done
                  ? 'bg-primary'
                  : 'bg-surface-container-high'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Question Card ────────────────────────────────────────────────── */}
      <div className="px-gutter-mobile mt-space-sm">
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-4">
          <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">{q.text}</p>

          {/* Banker's Matrix Table */}
          {q.matrix && (
            <div className="bg-surface-container rounded-xl p-3 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    {q.matrix.headers.map((h, i) => (
                      <th key={i} className="font-label-sm text-label-sm text-on-surface-variant pb-2 pr-3 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {q.matrix.rows.map((row, ri) => (
                    <tr key={ri} className="border-t border-outline-variant/30">
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className={`py-1.5 pr-3 whitespace-nowrap ${
                            ci === 0
                              ? 'font-label-md text-label-md text-on-surface font-bold'
                              : 'font-code-sm text-code-sm text-on-surface'
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 pt-2 border-t border-outline-variant/30 flex items-center gap-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Available:</span>
                <span className="font-code-sm text-code-sm text-secondary font-bold">{q.matrix.available}</span>
              </div>
            </div>
          )}

          {/* Answer Options */}
          <div className="flex flex-col gap-2">
            {q.options.map((opt) => {
              let borderClass = 'border-outline-variant/50';
              let bgClass = 'bg-surface-container-lowest hover:bg-surface-container-low';
              if (submitted && opt.correct) {
                borderClass = 'border-on-tertiary-container';
                bgClass = 'bg-tertiary-fixed/20';
              } else if (submitted && selected === opt.id && !opt.correct) {
                borderClass = 'border-error';
                bgClass = 'bg-error-container/30';
              } else if (selected === opt.id) {
                borderClass = 'border-primary';
                bgClass = 'bg-primary-fixed/20';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => !submitted && setSelected(opt.id)}
                  className={`w-full text-left p-3 rounded-xl border-2 ${borderClass} ${bgClass} transition-all flex items-start gap-2.5`}
                >
                  <span
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selected === opt.id ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant'
                    }`}
                  >
                    {selected === opt.id && (
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    )}
                  </span>
                  <span className="font-body-md text-body-md text-on-surface">{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Feedback ─────────────────────────────────────────────────────── */}
      {submitted && feedback && (
        <div className="px-gutter-mobile mt-space-sm">
          <div
            className={`p-space-md rounded-xl shadow-sm ${
              feedback.correct ? 'bg-tertiary-fixed/20 border border-on-tertiary-container/30' : 'bg-error-container/30 border border-error/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`material-symbols-outlined text-[20px] ${
                  feedback.correct ? 'text-on-tertiary-container' : 'text-error'
                }`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {feedback.correct ? 'check_circle' : 'cancel'}
              </span>
              <span className={`font-headline-sm text-headline-sm ${feedback.correct ? 'text-on-tertiary-container' : 'text-error'}`}>
                {feedback.correct ? 'Correct! 🎉' : 'Not quite...'}
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {feedback.correct
                ? 'The safe sequence ⟨P₁, P₃, P₄, P₂, P₀⟩ satisfies all resource needs progressively. Each process can finish and release its resources for the next.'
                : 'Review the Need matrix and Available vector. Try computing whether P₁ can be satisfied first, then chain from there.'}
            </p>
          </div>
        </div>
      )}

      {/* ── Action Buttons ───────────────────────────────────────────────── */}
      <div className="px-gutter-mobile mt-space-md pb-space-md flex gap-2">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className={`flex-1 py-3 rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] ${
              selected
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            Submit Answer
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate('/diagnostic')}
              className="flex-1 py-3 rounded-xl font-label-lg text-label-lg bg-surface-container-low text-on-surface flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[20px]">insights</span>
              View Diagnostic
            </button>
            <button
              onClick={() => {
                setSubmitted(false);
                setSelected(null);
                setFeedback(null);
              }}
              className="flex-1 py-3 rounded-xl font-label-lg text-label-lg bg-primary text-on-primary flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              Next Question
            </button>
          </>
        )}
      </div>
    </div>
  );
}
