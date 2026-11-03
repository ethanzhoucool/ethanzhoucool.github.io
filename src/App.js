import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Mail, Instagram, Linkedin, Youtube } from 'lucide-react';

import { useHashRoute } from './useHashRoute';
import { CustomCursor } from './components/ui';
import Backdrop from './components/Backdrop';
import Nav from './components/Nav';
import Home from './components/Home';
import Content from './components/Content';

/* The about narrative is eleven scroll-driven sections and the bulk of the
   framer-motion surface. It is only reachable at #/about, so it is split out
   of the main bundle rather than shipped to everyone who lands on home. */
const About = lazy(() => import('./about/About'));

/* Work is split out for the same reason: it carries the project artifacts,
   and it is where framer-motion would re-enter the main bundle the moment an
   artifact animates with it. Nothing on the home page needs either.

   It is warmed once the page is idle, and rendered directly once loaded.
   React.lazy on its own would still suspend on the first render even with
   the module already in memory, and React holds a suspended boundary's
   fallback for 300ms, so the first click on "work" would blank the page for
   that long. Measured, it took ~330ms to show work content against ~15ms
   when it was bundled. Rendering the loaded module directly keeps it at
   the old speed; LazyWork only covers someone landing straight on #/work. */
let WorkPage = null;
const loadWork = () =>
  import('./components/Work').then((m) => {
    WorkPage = m.default;
    return m;
  });
const LazyWork = lazy(loadWork);

function Work() {
  /* Chosen once per mount: switching from LazyWork to WorkPage mid-life would
     read to React as a different component and remount the whole page. */
  const [Page] = useState(() => WorkPage || LazyWork);
  return <Page />;
}

function warmWorkWhenIdle() {
  const warm = () => loadWork().catch(() => {});
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(warm, { timeout: 4000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(warm, 1500);
  return () => clearTimeout(id);
}

/* Holds the viewport while the chunk arrives, so the sticky sections below do
   not fight a collapsing scroll height. */
function RouteFallback() {
  return <div className="min-h-[100dvh]" aria-busy="true" />;
}

/* ════════════════════════════════════════
   SHELL
   ════════════════════════════════════════ */
const Portfolio = () => {
  const [route, navigate] = useHashRoute();
  const [easterEgg, setEasterEgg] = useState(false);

  /* Respect the OS preference on first load, then let the toggle win.
     matchMedia is guarded: jsdom does not implement it, and an unguarded call
     here takes the whole app down in tests rather than just losing the
     preference. */
  const [darkMode, setDarkMode] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(warmWorkWhenIdle, []);

  useEffect(() => {
    console.log(
      '%c👋 hi, you found the console!',
      'font-size: 20px; font-weight: bold; color: #2563eb;'
    );
    console.log(
      "%cif you're a recruiter reading this let's talk → info@ethanzhou.ca",
      'font-size: 14px; color: #2563eb;'
    );

    let buffer = '';
    const onKey = (e) => {
      buffer = (buffer + e.key.toLowerCase()).slice(-10);
      if (buffer.includes('hire')) {
        setEasterEgg(true);
        buffer = '';
        setTimeout(() => setEasterEgg(false), 5000);
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-slate-50 font-sans text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100">
      <Backdrop />

      <CustomCursor />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-slate-900 focus:px-5 focus:py-2.5 focus:text-sm focus:text-white dark:focus:bg-slate-50 dark:focus:text-slate-900"
      >
        Skip to content
      </a>

      {/* A CSS transition rather than AnimatePresence, so the shell needs no
          animation library. It also centres properly now: framer-motion wrote
          an inline `transform: none` at rest, which overrode -translate-x-1/2
          and left the toast hanging off to the right of centre. */}
      <div
        className={`easter-egg fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full border border-slate-200 bg-white px-6 py-3 shadow-card-hover dark:border-slate-700 dark:bg-slate-900${
          easterEgg ? ' is-shown' : ''
        }`}
        aria-hidden={!easterEgg}
      >
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          🎉 you typed &quot;hire&quot;. i like where this is going →{' '}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            info@ethanzhou.ca
          </span>
        </span>
      </div>

      <div className="relative z-10">
        <Nav
          route={route}
          navigate={navigate}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main id="main">
          {/* No AnimatePresence here on purpose. `mode="wait"` keeps the
              outgoing page mounted until its exit finishes, which meant a
              click on "about" left the work page on screen.

              The fade is CSS and keyed on the route, so remounting replays it.
              It used to be a framer-motion initial/animate pair, which meant
              the whole page mounted at opacity 0 and stayed there until a
              requestAnimationFrame callback ran — and rAF is throttled in an
              unfocused tab, so opening the site in a background tab showed
              nothing at all. */}
          <div key={route} className="route-fade">
            {route === 'home' && <Home navigate={navigate} />}
            {route === 'work' && (
              <Suspense fallback={<RouteFallback />}>
                <Work />
              </Suspense>
            )}
            {route === 'content' && <Content />}
            {route === 'about' && (
              <Suspense fallback={<RouteFallback />}>
                <About />
              </Suspense>
            )}
          </div>
        </main>

        <footer className="mx-auto max-w-5xl px-6 pb-12 pt-8">
          <div className="flex flex-col items-center gap-5 border-t border-slate-200 pt-10 dark:border-slate-800 sm:flex-row sm:justify-between">
            <div className="text-sm text-slate-400 dark:text-slate-600">
              © {new Date().getFullYear()} ethan zhou
            </div>
            <div className="flex gap-5">
              {[
                { href: 'mailto:info@ethanzhou.ca', Icon: Mail, label: 'Email' },
                { href: 'https://instagram.com/ethanzhouwealth', Icon: Instagram, label: 'Instagram' },
                { href: 'https://www.youtube.com/@Ethanzhouwealth', Icon: Youtube, label: 'YouTube' },
                { href: 'https://www.linkedin.com/in/ethan-zhou-832565315/', Icon: Linkedin, label: 'LinkedIn' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  data-hover
                  className="text-slate-400 transition-colors hover:text-slate-900 dark:text-slate-600 dark:hover:text-slate-200"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Portfolio;
