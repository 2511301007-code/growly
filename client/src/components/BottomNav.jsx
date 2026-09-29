import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', icon: 'dashboard', label: 'Home' },
  { to: '/revision', icon: 'menu_book', label: 'Library' },
  { to: '/tutor', icon: 'auto_awesome', label: 'Copilot', highlight: true },
  { to: '/flashcards', icon: 'style', label: 'Revision' },
  { to: '/diagnostic', icon: 'insights', label: 'Analytics' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/80 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-around h-16 px-space-xs">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-colors ${
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`
            }
          >
            {({ isActive }) =>
              tab.highlight ? (
                <>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_0_12px_rgba(254,166,25,0.35)] ${
                      isActive
                        ? 'bg-secondary-container/40 text-secondary'
                        : 'bg-secondary-container/20 text-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary font-bold mt-0.5">
                    {tab.label}
                  </span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[22px]">{tab.icon}</span>
                  <span className="font-label-sm text-label-sm">{tab.label}</span>
                </>
              )
            }
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
