import { useLocation } from 'react-router-dom';

const LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAVI-UUjoH_ltEchJAu9UdaFW7IIbJVezXyseNe5bLFDB0r08euVzbu4Bb46rON_ytkXcHqP615sIafEQG9PO-Zj72RE7dJl5XOf8qUHwJ6cS11ACbE0CLk-qWyfe2HQxtLQkWsKTp57-zYAdQ6exeXtdTH7_V7X25oWhvKtba4mtt9NGjgzmwVvrfRKw7TOuqSpIND4oqHJuMkFipBr9KtoHQ4ZshrZVNNmLPh1wcarCw7GMLGOr1mSw';

const pageTitle = {
  '/': 'Dashboard',
  '/tutor': 'AI Copilot',
  '/quiz': 'Practice Quiz',
  '/flashcards': 'Flashcards',
  '/diagnostic': 'Diagnostic',
  '/revision': 'Smart Revision',
};

export default function Header() {
  const { pathname } = useLocation();
  const title = pageTitle[pathname] || 'Dashboard';

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 px-gutter-mobile flex items-center justify-between">
        {/* Left – brand */}
        <div className="flex items-center gap-space-sm">
          <img alt="Growly Logo" className="h-8 w-auto object-contain" src={LOGO_URL} />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface leading-none">
              Growly
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant leading-none mt-1">
              {title}
            </span>
          </div>
        </div>

        {/* Right – actions */}
        <div className="flex items-center gap-space-xs">
          {/* Streak badge */}
          <div className="flex items-center gap-1 bg-secondary-fixed/50 px-2.5 py-1 rounded-full shadow-[0_0_0_1px_rgba(245,158,11,0.25)]">
            <span
              className="material-symbols-outlined text-secondary text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
            <span className="font-label-md text-label-md text-on-secondary-container font-bold">
              12d
            </span>
          </div>

          {/* Search */}
          <button
            aria-label="Search"
            className="w-11 h-11 flex items-center justify-center rounded-xl text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">search</span>
          </button>

          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="w-11 h-11 flex items-center justify-center rounded-xl text-on-surface-variant hover:text-on-surface transition-colors relative"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary-container" />
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-1">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
