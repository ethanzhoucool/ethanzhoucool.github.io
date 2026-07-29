import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ROUTES } from '../useHashRoute';

const LABELS = {
  home: 'home',
  work: 'work',
  about: 'about',
  content: 'content',
};

/*
 * The old nav scrolled away with the page, which meant that on a 17-screen
 * narrative you could not navigate at all without scrolling back to the top.
 * This one sticks, stays on one line, and stays under 72px.
 */
export default function Nav({ route, navigate, darkMode, setDarkMode }) {
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    /* IntersectionObserver on a sentinel, not a scroll listener. */
    const sentinel = document.getElementById('nav-sentinel');
    if (!sentinel) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setCondensed(!entry.isIntersecting),
      { rootMargin: '0px' }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div id="nav-sentinel" aria-hidden="true" className="absolute top-0 h-px w-px" />
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          condensed
            ? 'bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800/70'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className={`mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 transition-all duration-300 ${
            condensed ? 'h-14' : 'h-[68px]'
          }`}
        >
          <button
            onClick={() => navigate('home')}
            className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50 transition-opacity hover:opacity-60 active:scale-[0.98]"
          >
            ethan zhou
          </button>

          <div className="flex items-center gap-1">
            {ROUTES.filter((r) => r !== 'home').map((r) => {
              const active = route === r;
              return (
                <button
                  key={r}
                  onClick={() => navigate(r)}
                  aria-current={active ? 'page' : undefined}
                  className={`relative rounded-full px-3 py-1.5 text-sm transition-colors duration-200 sm:px-4 ${
                    active
                      ? 'text-slate-900 dark:text-slate-50'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                  }`}
                >
                  {active && (
                    <span className="absolute inset-0 rounded-full bg-slate-900/[0.06] dark:bg-slate-100/[0.10]" />
                  )}
                  <span className="relative">{LABELS[r]}</span>
                </button>
              );
            })}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="ml-1 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-900/[0.06] hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-100/[0.10] dark:hover:text-slate-100"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
