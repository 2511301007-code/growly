import { useState, useEffect, useCallback } from 'react';
import { getFlashcardDecks, rateFlashcard } from '../services/api';

const FALLBACK_CARDS = [
  {
    id: 'fc1',
    front: {
      topic: 'Operating Systems',
      question: 'What is a deadlock in the context of operating systems?',
      hint: 'Think about processes waiting for resources held by others...',
    },
    back: {
      answer:
        'A deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process in the set.',
      keyTakeaway:
        'Deadlock requires 4 conditions simultaneously: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.',
      verified: true,
    },
  },
  {
    id: 'fc2',
    front: {
      topic: 'Operating Systems',
      question: 'Explain the Banker\'s Algorithm and its purpose.',
      hint: 'Named after a banker managing loans with limited capital...',
    },
    back: {
      answer:
        'The Banker\'s Algorithm is a deadlock avoidance algorithm that tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources, then checks if a safe sequence exists.',
      keyTakeaway:
        'It uses Available, Max, Allocation, and Need matrices to determine if granting a request leads to a safe state.',
      verified: true,
    },
  },
  {
    id: 'fc3',
    front: {
      topic: 'Operating Systems',
      question: 'What is the difference between a process and a thread?',
      hint: 'Consider memory space sharing and creation overhead...',
    },
    back: {
      answer:
        'A process is an independent program in execution with its own memory space. A thread is a lightweight unit of execution within a process that shares the same memory space with other threads of that process.',
      keyTakeaway:
        'Threads share code, data, and OS resources but have separate stacks and registers. Context switching between threads is faster than between processes.',
      verified: true,
    },
  },
];

export default function Flashcards() {
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [ratings, setRatings] = useState({});
  const [totalCards, setTotalCards] = useState(32);

  useEffect(() => {
    getFlashcardDecks()
      .then((d) => {
        const allCards = d.decks?.[0]?.cards || d.cards || FALLBACK_CARDS;
        setCards(allCards);
        setTotalCards(allCards.length || 32);
      })
      .catch(() => setCards(FALLBACK_CARDS));
  }, []);

  const card = cards[index];
  const progress = totalCards > 0 ? Math.round(((index + 1) / totalCards) * 100) : 0;

  const handleFlip = useCallback(() => {
    setFlipped((f) => !f);
    setShowHint(false);
  }, []);

  const handleRate = async (rating) => {
    if (!card) return;
    setRatings((r) => ({ ...r, [card.id]: rating }));
    try {
      await rateFlashcard(card.id, rating);
    } catch {/* backend may not be running */}
    // Move to next card
    setFlipped(false);
    setShowHint(false);
    if (index < cards.length - 1) {
      setIndex((i) => i + 1);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space') { e.preventDefault(); handleFlip(); }
      if (e.code === 'ArrowRight' && index < cards.length - 1) { setIndex((i) => i + 1); setFlipped(false); setShowHint(false); }
      if (e.code === 'ArrowLeft' && index > 0) { setIndex((i) => i - 1); setFlipped(false); setShowHint(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [index, cards.length, handleFlip]);

  if (!card) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const RATINGS = [
    { label: 'Again', key: 'again', color: 'bg-error text-on-error' },
    { label: 'Hard', key: 'hard', color: 'bg-secondary text-on-secondary' },
    { label: 'Good', key: 'good', color: 'bg-secondary-container text-on-secondary-container' },
    { label: 'Easy', key: 'easy', color: 'bg-on-tertiary-container text-on-tertiary' },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* ── Session Progress ─────────────────────────────────────────────── */}
      <div className="px-gutter-mobile pt-3 pb-2 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-headline-sm text-headline-sm text-on-surface">
              Card {index + 1} <span className="text-on-surface-variant font-body-md text-body-md">of {totalCards}</span>
            </span>
          </div>
          <span className="font-label-md text-label-md text-secondary font-bold">{progress}% Complete</span>
        </div>
        <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
          <div
            className="bg-secondary-container h-full rounded-full transition-all duration-500 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-label-sm text-label-sm text-on-surface-variant">{card.front.topic}</span>
          <span className="w-1 h-1 rounded-full bg-outline-variant" />
          <span className="font-label-sm text-label-sm text-on-surface-variant">
            Spaced Repetition Deck
          </span>
        </div>
      </div>

      {/* ── 3D Flip Card ─────────────────────────────────────────────────── */}
      <div className="px-gutter-mobile mt-space-md">
        <div className="flip-card w-full" style={{ minHeight: '320px' }}>
          <div
            className={`flip-card-inner w-full cursor-pointer ${flipped ? 'flipped' : ''}`}
            onClick={handleFlip}
            style={{ minHeight: '320px' }}
          >
            {/* Front */}
            <div className="flip-card-front absolute inset-0 bg-surface-container-lowest rounded-2xl shadow-lg p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm bg-secondary-fixed/50 text-on-secondary-container px-2.5 py-1 rounded-full font-bold">
                    Question
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowHint(!showHint); }}
                    className="flex items-center gap-1 text-on-surface-variant hover:text-secondary text-label-sm font-label-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                    <span>{showHint ? 'Hide' : 'Show'} Hint</span>
                  </button>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface leading-snug">
                  {card.front.question}
                </h3>
                {showHint && (
                  <div className="bg-secondary-fixed/20 p-3 rounded-xl animate-in">
                    <p className="font-body-sm text-body-sm text-on-secondary-container italic">
                      💡 {card.front.hint}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center gap-1 text-on-surface-variant mt-4">
                <span className="material-symbols-outlined text-[16px]">touch_app</span>
                <span className="font-label-sm text-label-sm">Tap or press Space to flip</span>
              </div>
            </div>

            {/* Back */}
            <div className="flip-card-back absolute inset-0 bg-surface-container-lowest rounded-2xl shadow-lg p-6 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm bg-on-tertiary-container/10 text-on-tertiary-container px-2.5 py-1 rounded-full font-bold">
                    Answer
                  </span>
                  {card.back.verified && (
                    <div className="flex items-center gap-1 text-on-tertiary-container">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      <span className="font-label-sm text-label-sm font-semibold">AI Verified</span>
                    </div>
                  )}
                </div>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed">{card.back.answer}</p>
                <div className="bg-surface-container-low p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 text-secondary font-label-md text-label-md mb-1">
                    <span className="material-symbols-outlined text-[16px]">star</span>
                    <span>Key Takeaway</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface">{card.back.keyTakeaway}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Confidence Rating ────────────────────────────────────────────── */}
      {flipped && (
        <div className="px-gutter-mobile mt-space-md space-y-2">
          <span className="font-label-sm text-label-sm text-on-surface-variant text-center block">
            How well did you know this?
          </span>
          <div className="grid grid-cols-4 gap-2">
            {RATINGS.map((r) => (
              <button
                key={r.key}
                onClick={() => handleRate(r.key)}
                className={`py-2.5 rounded-xl font-label-lg text-label-lg ${r.color} shadow-sm transition-all active:scale-95 hover:shadow-md`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Deck Controls ────────────────────────────────────────────────── */}
      <div className="px-gutter-mobile mt-space-md pb-space-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
            onClick={() => {
              const shuffled = [...cards].sort(() => Math.random() - 0.5);
              setCards(shuffled);
              setIndex(0);
              setFlipped(false);
            }}
          >
            <span className="material-symbols-outlined text-[20px]">shuffle</span>
          </button>
          <button className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { if (index > 0) { setIndex((i) => i - 1); setFlipped(false); setShowHint(false); } }}
            disabled={index === 0}
            className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <button
            onClick={() => { if (index < cards.length - 1) { setIndex((i) => i + 1); setFlipped(false); setShowHint(false); } }}
            disabled={index >= cards.length - 1}
            className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center transition-colors disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
