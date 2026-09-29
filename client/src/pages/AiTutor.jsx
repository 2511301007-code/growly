import { useState, useRef, useEffect } from 'react';
import { sendTutorMessage, getTutorSuggestions } from '../services/api';

const MODES = [
  { id: 'explain', icon: 'psychology', label: 'Explain' },
  { id: 'deep_dive', icon: 'travel_explore', label: 'Deep Dive' },
  { id: 'real_world', icon: 'lightbulb', label: 'Real-world Example' },
  { id: 'simplify', icon: 'compress', label: 'Simplify' },
  { id: 'socratic', icon: 'forum', label: 'Socratic' },
  { id: 'quiz_me', icon: 'quiz', label: 'Quiz Me' },
];

const INITIAL_MESSAGES = [
  {
    role: 'user',
    text: 'Can you explain the Dining Philosophers problem and how to prevent circular wait deadlock in simple terms?',
    time: '10:42 AM',
  },
  {
    role: 'assistant',
    concept: {
      title: 'Concept Snapshot',
      body: 'Imagine **5 thinkers** sitting at a round table with only **5 chopsticks**. Each needs *two chopsticks* simultaneously to eat spaghetti. If every philosopher grabs their right stick at the exact same second, all are frozen holding one fork—waiting forever on their left neighbor. This is a classic **Circular Wait deadlock**.',
    },
    solution: {
      title: "Dijkstra's Asymmetric Solution",
      body: 'To eliminate the circular wait condition, force an **odd-even hierarchy**: odd philosophers pick the left chopstick first, while even ones reach for the right chopstick first. At least one philosopher will always get both forks!',
    },
    code: `// Odd-Even Resource Ordering
void eat(int i) {
  if (i % 2 == 0) {
    wait(chopstick[(i + 1) % 5]); // Right fork first
    wait(chopstick[i]);           // Left fork second
  } else {
    wait(chopstick[i]);           // Left fork first
    wait(chopstick[(i + 1) % 5]); // Right fork second
  }
  digest();
  signal(chopstick[i]);
  signal(chopstick[(i + 1) % 5]);
}`,
    chapter: 'Chapter 7: Deadlocks & Synchronization',
    time: '10:43 AM',
  },
];

const SUGGESTIONS = [
  { icon: 'account_balance', text: "How does Dijkstra's solution contrast with the Banker's Algorithm?" },
  { icon: 'balance', text: "Why doesn't breaking circular wait prevent starvation?" },
  { icon: 'verified_user', text: 'Give me an exam-style multiple choice question on this.' },
];

export default function AiTutor() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [activeMode, setActiveMode] = useState('explain');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: msg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setLoading(true);
    try {
      const res = await sendTutorMessage(msg, activeMode, { topic: 'Operating Systems', unit: 3 });
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          concept: { title: 'Copilot Response', body: res.response || res.message || 'Let me think about that...' },
          chapter: res.chapter || 'Operating Systems',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          concept: { title: 'Copilot Response', body: 'I\'m processing your question. The backend may not be running yet — please start the server with `npm run dev:server`.' },
          chapter: 'System',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full" ref={scrollRef}>
      {/* ── Active Workspace Context ──────────────────────────────────────── */}
      <section className="px-gutter-mobile pt-3 pb-2 space-y-2.5">
        <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm flex flex-col gap-1.5 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-secondary-fixed/20 pointer-events-none blur-xl" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse" />
              <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                Active Workspace
              </span>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded-full text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[14px] text-on-tertiary-container">verified</span>
              <span>Syllabus Matched</span>
            </div>
          </div>
          <div className="flex items-start gap-2 pt-0.5">
            <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5 shrink-0">menu_book</span>
            <div className="min-w-0">
              <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">
                Operating Systems · Unit 3
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                Process Synchronization · Prof. Sharma's Lecture Deck
              </p>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-nowrap">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={`group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full shadow-sm transition-all active:scale-95 ${
                activeMode === mode.id
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[16px] ${
                  activeMode === mode.id ? 'text-secondary-container' : ''
                }`}
              >
                {mode.icon}
              </span>
              <span className="font-label-md text-label-md">{mode.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Conversation Thread ───────────────────────────────────────────── */}
      <section className="px-gutter-mobile space-y-4 py-2">
        {messages.map((msg, i) =>
          msg.role === 'user' ? (
            <div key={i} className="flex justify-end pl-8">
              <div className="bg-primary text-on-primary rounded-2xl rounded-tr-sm p-4 shadow-sm flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-on-primary-container font-label-sm text-label-sm">
                  <span>You</span>
                  <span>{msg.time}</span>
                </div>
                <p className="font-body-md text-body-md text-on-primary leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ) : (
            <div key={i} className="flex flex-col bg-surface-container-lowest rounded-2xl shadow-md overflow-hidden">
              {/* Banner */}
              <div className="bg-gradient-to-r from-secondary-fixed/40 via-surface-container-low to-surface-container-lowest px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-label-md text-label-md text-on-surface">Growly Copilot</span>
                      <span className="bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm px-1.5 py-0.5 rounded">
                        Tutor AI
                      </span>
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Aligned with {msg.chapter}
                    </p>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface-variant flex items-center justify-center hover:text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
                </button>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3.5">
                {msg.concept && (
                  <div className="bg-surface-container-low p-3.5 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5 text-secondary font-label-md text-label-md">
                      <span className="material-symbols-outlined text-[16px]">menu_book</span>
                      <span>{msg.concept.title}</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">
                      {msg.concept.body}
                    </p>
                  </div>
                )}

                {/* SVG Diagram (only on initial message) */}
                {i === 1 && (
                  <div className="bg-surface-container p-3 rounded-xl flex flex-col items-center gap-2">
                    <div className="w-full flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm px-1">
                      <span className="font-bold text-on-surface">Resource Sharing Graph</span>
                      <span>N = 5 Circular Dep</span>
                    </div>
                    <div className="w-full max-w-[280px] py-1 flex items-center justify-center">
                      <svg className="w-full h-auto text-on-surface" viewBox="0 0 240 240">
                        <circle cx="120" cy="120" fill="#f2f4f6" r="76" />
                        <circle cx="120" cy="120" fill="#ffffff" r="54" />
                        <text fill="#855300" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="700" textAnchor="middle" x="120" y="123">PASTA BOWL</text>
                        {[
                          { cx: 120, cy: 22, label: 'P₀' },
                          { cx: 212, cy: 88, label: 'P₁' },
                          { cx: 178, cy: 198, label: 'P₂' },
                          { cx: 62, cy: 198, label: 'P₃' },
                          { cx: 28, cy: 88, label: 'P₄' },
                        ].map((p, pi) => (
                          <g key={pi}>
                            <circle cx={p.cx} cy={p.cy} fill="#131b2e" r="16" />
                            <text fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" x={p.cx} y={p.cy + 4}>{p.label}</text>
                          </g>
                        ))}
                        {[
                          { x: 68, y: 48, rot: -36, ox: 71, oy: 60, lx: 60, ly: 60, l: 'C₀' },
                          { x: 166, y: 48, rot: 36, ox: 169, oy: 60, lx: 175, ly: 60, l: 'C₁' },
                          { x: 200, y: 140, rot: 72, ox: 203, oy: 152, lx: 207, ly: 152, l: 'C₂' },
                          { x: 117, y: 184, rot: 90, ox: 120, oy: 196, lx: 120, ly: 184, l: 'C₃', ta: 'middle' },
                          { x: 34, y: 140, rot: -72, ox: 37, oy: 152, lx: 24, ly: 152, l: 'C₄' },
                        ].map((c, ci) => (
                          <g key={ci}>
                            <rect fill="#fea619" height="24" rx="3" transform={`rotate(${c.rot} ${c.ox} ${c.oy})`} width="6" x={c.x} y={c.y} />
                            <text fill="#684000" fontSize="9" fontWeight="600" textAnchor={c.ta || 'start'} x={c.lx} y={c.ly}>{c.l}</text>
                          </g>
                        ))}
                      </svg>
                    </div>
                    <span className="font-label-sm text-label-sm text-center text-on-surface-variant">
                      Deadlock condition: Every Pi holds Ci and waits indefinitely on C(i+1)%5
                    </span>
                  </div>
                )}

                {msg.solution && (
                  <div className="space-y-1.5">
                    <h4 className="font-headline-sm text-headline-sm text-on-surface">{msg.solution.title}</h4>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{msg.solution.body}</p>
                  </div>
                )}

                {msg.code && (
                  <div className="bg-primary-container rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-on-primary-container font-code-sm text-code-sm">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-error" />
                        <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
                        <span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container" />
                        <span className="ml-1 text-surface-variant font-medium">philosopher_sync.c</span>
                      </span>
                      <button
                        onClick={() => navigator.clipboard?.writeText(msg.code)}
                        className="text-surface-variant hover:text-on-primary flex items-center gap-1 text-[11px]"
                      >
                        <span className="material-symbols-outlined text-[14px]">content_copy</span>
                        Copy
                      </button>
                    </div>
                    <pre className="font-code-sm text-code-sm text-surface-container overflow-x-auto leading-relaxed py-1 whitespace-pre-wrap">
                      {msg.code}
                    </pre>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="pt-1 flex flex-wrap gap-1.5">
                  {[
                    { icon: 'edit_note', label: 'Save to Study Notes', color: 'text-secondary' },
                    { icon: 'style', label: 'Generate 4 Flashcards', color: 'text-secondary' },
                    { icon: 'quiz', label: 'Test My Recall', color: 'text-on-tertiary-container' },
                  ].map((a, ai) => (
                    <button
                      key={ai}
                      className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface px-2.5 py-1.5 rounded-lg text-label-sm font-label-sm transition-colors shadow-sm"
                    >
                      <span className={`material-symbols-outlined ${a.color} text-[16px]`}>{a.icon}</span>
                      <span>{a.label}</span>
                    </button>
                  ))}
                  <button className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface px-2 py-1.5 rounded-lg text-label-sm font-label-sm transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-on-surface-variant text-[16px]">volume_up</span>
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {loading && (
          <div className="flex items-center gap-2 px-4 py-3 bg-surface-container-lowest rounded-2xl shadow-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Growly is thinking...</span>
          </div>
        )}

        {/* Suggested Explorations */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 px-1">
            <span className="material-symbols-outlined text-secondary text-[16px]">arrow_back_ios_new</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold tracking-wider">
              Suggested Exploration
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {SUGGESTIONS.map((s, si) => (
              <button
                key={si}
                onClick={() => handleSend(s.text)}
                className="w-full text-left bg-surface-container-lowest hover:bg-surface-container-low p-2.5 rounded-xl shadow-sm flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">
                    {s.icon}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface font-medium">{s.text}</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[18px] shrink-0">
                  arrow_forward
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sticky Composer ───────────────────────────────────────────────── */}
      <div className="sticky bottom-0 z-40 px-gutter-mobile pt-2 pb-3 bg-surface/90 backdrop-blur-md">
        <div className="bg-surface-container-lowest rounded-2xl shadow-lg p-2.5 space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
              <span className="font-label-sm text-label-sm text-secondary font-semibold">
                Mode: {MODES.find((m) => m.id === activeMode)?.label || 'Explain'}
              </span>
            </div>
            <button className="font-label-sm text-label-sm text-on-surface-variant hover:text-on-surface flex items-center gap-0.5">
              <span>Unit 3 Scope</span>
              <span className="material-symbols-outlined text-[14px]">tune</span>
            </button>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-low rounded-xl px-3 py-1.5">
            <textarea
              className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none resize-none max-h-24"
              placeholder="Ask a question or request a derivation..."
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-1">
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-[20px]">mic</span>
              </button>
              <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low text-label-sm font-label-sm transition-colors">
                <span className="material-symbols-outlined text-[18px]">attach_file</span>
                <span>Attach note</span>
              </button>
            </div>
            <button
              onClick={() => handleSend()}
              className="bg-primary hover:bg-on-primary-fixed-variant text-on-primary pl-3 pr-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary-container">auto_awesome</span>
              <span className="font-label-md text-label-md">Ask Copilot</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
