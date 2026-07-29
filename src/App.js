import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { Mail, Instagram, Linkedin, Youtube } from 'lucide-react';

import { useHashRoute } from './useHashRoute';
import { CustomCursor } from './components/ui';
import Nav from './components/Nav';
import Home from './components/Home';
import Work from './components/Work';
import Content from './components/Content';

/* The about narrative is eleven scroll-driven sections and the bulk of the
   framer-motion surface. It is only reachable at #/about, so it is split out
   of the main bundle rather than shipped to everyone who lands on home. */
const About = lazy(() => import('./about/About'));

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

  /* The pointer-following backdrop used to live in useState, so every single
     mousemove re-rendered the whole page. Motion values keep it off the React
     render path entirely. */
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const bgX = useTransform(smx, (v) => `${v * 100}%`);
  const bgY = useTransform(smy, (v) => `${v * 100}%`);
  const tint = darkMode ? 'rgba(51, 65, 85, 0.40)' : 'rgba(219, 234, 254, 0.60)';
  const backdrop = useMotionTemplate`radial-gradient(ellipse 80% 60% at ${bgX} ${bgY}, ${tint}, rgba(0,0,0,0) 100%)`;

  const onPointerMove = useCallback(
    (e) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    },
    [mx, my]
  );

  useEffect(() => {
    window.addEventListener('mousemove', onPointerMove, { passive: true });

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
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [onPointerMove]);

  return (
    <div className="min-h-[100dvh] bg-slate-50 font-sans text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100">
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: backdrop }}
        aria-hidden="true"
      />

      <CustomCursor />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-slate-900 focus:px-5 focus:py-2.5 focus:text-sm focus:text-white dark:focus:bg-slate-50 dark:focus:text-slate-900"
      >
        Skip to content
      </a>

      <AnimatePresence>
        {easterEgg && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full border border-slate-200 bg-white px-6 py-3 shadow-card-hover dark:border-slate-700 dark:bg-slate-900"
          >
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              🎉 you typed &quot;hire&quot;. i like where this is going →{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                info@ethanzhou.ca
              </span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

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
              click on "about" left the work page on screen. A keyed fade-in
              gives the same feel with none of the handover risk, and the new
              route is in the DOM immediately for anchors and screen readers. */}
          <motion.div
            key={route}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {route === 'home' && <Home navigate={navigate} />}
            {route === 'work' && <Work />}
            {route === 'content' && <Content />}
            {route === 'about' && (
              <Suspense fallback={<RouteFallback />}>
                <About />
              </Suspense>
            )}
          </motion.div>
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
