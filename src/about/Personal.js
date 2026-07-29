import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';

/* ─── Hobbies grid with click-to-expand ─── */
const HobbiesSection = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  /* These two reveal on useInView rather than scroll progress, so
     useNarrativeProgress does not reach them. Without this they stay at
     opacity 0 for a reduced-motion user: a blank panel, not a calm one. */
  const isInView = useInView(ref, { once: true, margin: '-5% 0px -5% 0px' }) || reduce;
  const [activeHobby, setActiveHobby] = useState(null);
  const closeRef = useRef(null);
  const openerRef = useRef(null);

  const openHobby = useCallback((hobby) => {
    openerRef.current = document.activeElement;
    setActiveHobby(hobby);
  }, []);

  const closeHobby = useCallback(() => {
    setActiveHobby(null);
    /* Send focus back where it came from, otherwise a keyboard user is
       dumped at the top of the document. */
    if (openerRef.current?.focus) openerRef.current.focus();
  }, []);

  /* The dialog had no Escape handler, no focus move and no close button: once
     open, a keyboard user was stuck in it. */
  useEffect(() => {
    if (!activeHobby) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeHobby();
      }
    };
    document.addEventListener('keydown', onKey);

    const t = setTimeout(() => closeRef.current?.focus(), 0);

    /* Stop the page behind the dialog scrolling under it. */
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, [activeHobby, closeHobby]);

  /* The jiu jitsu card rendered as an empty white box until the 6.9MB mp4
     finished downloading. A poster frame gives it something to show. */
  const hobbies = [
    { type: 'video', src: '/images/jiujitsu.mp4', poster: '/images/jiujitsu-poster.jpg', label: 'jiu jitsu' },
    { type: 'img', src: '/images/badminton.jpg', label: 'badminton' },
    { type: 'img', src: '/images/hockey.jpg', label: 'hockey' },
    { type: 'img', src: '/images/investing.jpg', label: 'investing' },
  ];

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 dark:border-slate-800">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 sm:mb-6 flex items-center gap-2">
            <span className="text-blue-500 dark:text-blue-400">✦</span> hobbies
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {/* Buttons, not divs. These were `<div onClick>` with no tabIndex,
                role or key handler, so they could not be opened without a
                mouse at all. */}
            {hobbies.map((hobby, i) => (
              <motion.button
                key={hobby.label}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="group block w-full text-left bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                onClick={() => openHobby(hobby)}
                aria-haspopup="dialog"
                data-hover
              >
                <div className="aspect-square relative overflow-hidden">
                  {hobby.type === 'video' ? (
                    <video src={hobby.src} poster={hobby.poster} preload="metadata" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" autoPlay loop muted playsInline />
                  ) : (
                    <img src={hobby.src} alt={hobby.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="p-3 sm:p-4 text-center">
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">{hobby.label}</h3>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Fullscreen modal overlay */}
      <AnimatePresence>
        {activeHobby && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeHobby}
            role="dialog"
            aria-modal="true"
            aria-label={activeHobby.label}
          >
            <motion.div
              className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                ref={closeRef}
                onClick={closeHobby}
                aria-label="Close"
                data-hover
                className="absolute right-3 top-3 z-10 rounded-full bg-slate-900/60 p-2 text-white backdrop-blur transition-colors hover:bg-slate-900/80"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="aspect-square sm:aspect-[4/3] relative overflow-hidden">
                {activeHobby.type === 'video' ? (
                  <video src={activeHobby.src} poster={activeHobby.poster} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                ) : (
                  <img src={activeHobby.src} alt={activeHobby.label} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">{activeHobby.label}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Quick facts with fade-in ─── */
const QuickFacts = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  /* These two reveal on useInView rather than scroll progress, so
     useNarrativeProgress does not reach them. Without this they stay at
     opacity 0 for a reduced-motion user: a blank panel, not a calm one. */
  const isInView = useInView(ref, { once: true, margin: '-5% 0px -5% 0px' }) || reduce;

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 dark:border-slate-800">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="text-blue-500 dark:text-blue-400">✦</span> quick facts
          </h2>
          <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm sm:text-base">
            <li className="flex items-start gap-3">
              <span className="text-blue-500 dark:text-blue-400 text-xl">→</span>
              <span>I speak 2.5 languages (english, chinese, and learning french)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 dark:text-blue-400 text-xl">→</span>
              <span>my favourite dish is eggs and tomatoes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 dark:text-blue-400 text-xl">→</span>
              <span>I enjoy snowboarding in the Rockies (love sunshine)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 dark:text-blue-400 text-xl">→</span>
              <span>1400 rapid chess - <a href="https://www.chess.com/member/xxhyperinsanexx" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline" data-hover>challenge me!</a></span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Scroll-driven ambient atmosphere for about page ─── */

export { HobbiesSection, QuickFacts };
