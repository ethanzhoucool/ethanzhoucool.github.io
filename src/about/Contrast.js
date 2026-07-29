import { useRef, useMemo } from 'react';
import { motion, useTransform, useSpring } from 'framer-motion';
import { useNarrativeProgress } from './primitives';

/* ─── Single animated word — scroll-progress driven ─── */
const ScrollWord = ({ word, scrollYProgress, start, end }) => {
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [12, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block mr-[0.3em]">
      {word}
    </motion.span>
  );
};

/* ─── Per-letter wobble for "uncomfortable" ─── */

/* ─── Per-letter wobble for "uncomfortable" ─── */
const UncomfortableLetter = ({ char, progress, offsetX, offsetScaleY, offsetRotate }) => {
  const x = useTransform(progress, [0.2, 0.32], [offsetX, 0]);
  const springX = useSpring(x, { stiffness: 300, damping: 12 });
  const scaleY = useTransform(progress, [0.2, 0.32], [offsetScaleY, 1]);
  const springScaleY = useSpring(scaleY, { stiffness: 300, damping: 12 });
  const rotate = useTransform(progress, [0.2, 0.32], [offsetRotate, 0]);
  const springRotate = useSpring(rotate, { stiffness: 300, damping: 12 });
  const opacity = useTransform(progress, [0.2, 0.28], [0, 1]);

  return (
    <motion.span
      style={{ x: springX, scaleY: springScaleY, rotate: springRotate, opacity, display: 'inline-block' }}
    >
      {char}
    </motion.span>
  );
};

/* ─── The Contrast — sticky scroll-locked ─── */

/* ─── The Contrast — sticky scroll-locked ─── */
const ContrastSection = () => {
  const ref = useRef(null);
  const scrollYProgress = useNarrativeProgress({
    target: ref,
    offset: ['start start', 'end start'],
  }, 0.75);

  const words1 = "But most people don't take them.".split(' ');
  const words2 = "Not because they can't".split(' ');

  /* "uncomfortable" reveal */
  const uncomfOpacity = useTransform(scrollYProgress, [0.2, 0.32], [0, 1]);

  /* Pre-computed letter offsets for "uncomfortable." wobble */
  const uncomfLetters = useMemo(() =>
    'uncomfortable.'.split('').map((char, i) => ({
      char,
      offsetX: Math.sin(i * 7.3 + 2.1) * 8,
      offsetScaleY: 1 + Math.cos(i * 5.7 + 1.3) * 0.05,
      offsetRotate: Math.sin(i * 4.1 + 3.7) * 3,
    }))
  , []);

  /* Brief warm flash during uncomfortable reveal */
  const warmFlash = useTransform(scrollYProgress, [0.2, 0.26, 0.32], [0, 0.04, 0]);

  /* "status quo" */
  const statusOpacity = useTransform(scrollYProgress, [0.32, 0.42], [0, 1]);

  /* Scale visual */
  const scaleVisOpacity = useTransform(scrollYProgress, [0.42, 0.52], [0, 1]);
  const scaleVisY = useTransform(scrollYProgress, [0.42, 0.52], [20, 0]);

  /* Left/right arms */
  const leftX = useTransform(scrollYProgress, [0.48, 0.58], [30, 0]);
  const leftOpacity = useTransform(scrollYProgress, [0.48, 0.58], [0, 1]);
  const rightX = useTransform(scrollYProgress, [0.48, 0.58], [-30, 0]);
  const rightOpacity = useTransform(scrollYProgress, [0.48, 0.58], [0, 1]);
  const pivotScale = useTransform(scrollYProgress, [0.46, 0.54], [0, 1]);

  /* Label */
  const labelOpacity = useTransform(scrollYProgress, [0.58, 0.68], [0, 1]);

  return (
    <div ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-2xl mx-auto space-y-10 sm:space-y-14">

        {/* Line 1: word-by-word stagger */}
        <div className="text-center">
          <p className="text-xl sm:text-2xl md:text-3xl text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            {words1.map((word, i) => (
              <ScrollWord
                key={`w1-${i}`}
                word={word}
                scrollYProgress={scrollYProgress}
                start={0.02 + (i / words1.length) * 0.1}
                end={0.02 + (i / words1.length) * 0.1 + 0.04}
              />
            ))}
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl text-slate-700 dark:text-slate-200 leading-relaxed font-medium mt-1">
            {words2.map((word, i) => (
              <ScrollWord
                key={`w2-${i}`}
                word={word}
                scrollYProgress={scrollYProgress}
                start={0.1 + (i / words2.length) * 0.08}
                end={0.1 + (i / words2.length) * 0.08 + 0.04}
              />
            ))}
          </p>
        </div>

        {/* "because it's uncomfortable" — per-letter wobble with warm flash */}
        <div className="text-center space-y-2">
          <motion.p style={{ opacity: uncomfOpacity }} className="text-sm sm:text-base text-slate-400 dark:text-slate-500">
            but because it's
          </motion.p>
          <div className="relative inline-block">
            <motion.div style={{ opacity: warmFlash }} className="absolute -inset-4 bg-red-400/20 dark:bg-red-500/10 rounded-2xl pointer-events-none" />
            <p className="relative text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 dark:text-slate-100 tracking-tight inline-flex">
              {uncomfLetters.map((l, i) => (
                <UncomfortableLetter key={i} char={l.char} progress={scrollYProgress}
                  offsetX={l.offsetX} offsetScaleY={l.offsetScaleY} offsetRotate={l.offsetRotate} />
              ))}
            </p>
          </div>
        </div>

        {/* "So they choose the status quo" — faded, smaller */}
        <motion.p
          style={{ opacity: statusOpacity }}
          className="text-center text-base sm:text-lg text-slate-400 dark:text-slate-500"
        >
          So they choose the <span className="italic">status quo</span>.
        </motion.p>

        {/* Symmetric scale visual — SVG balanced beam (mirrors the lever, but level) */}
        <motion.div
          style={{ opacity: scaleVisOpacity, y: scaleVisY }}
          className="pt-4 sm:pt-8"
        >
          <div className="max-w-xs sm:max-w-sm mx-auto">
            <svg viewBox="0 0 400 80" className="w-full overflow-visible">
              {/* Fulcrum — centered at 50% (perfectly symmetric) */}
              <motion.polygon
                points="200,36 188,62 212,62"
                className="fill-slate-200 dark:fill-slate-700"
                style={{ scale: pivotScale, transformOrigin: '200px 50px' }}
              />
              {/* Beam — perfectly level */}
              <motion.rect
                x="40" y="28" width="320" height="4" rx="2"
                className="fill-slate-300 dark:fill-slate-600"
                style={{ opacity: leftOpacity }}
              />
              {/* Equal circles on each end — same size (symmetric) */}
              <motion.circle cx="80" cy="18" r="14"
                className="fill-slate-300 dark:fill-slate-500"
                style={{ x: leftX, opacity: leftOpacity }}
              />
              <motion.circle cx="320" cy="18" r="14"
                className="fill-slate-300 dark:fill-slate-500"
                style={{ x: rightX, opacity: rightOpacity }}
              />
              {/* Labels */}
              <motion.text x="80" y="75" textAnchor="middle"
                className="fill-slate-400 dark:fill-slate-500"
                style={{ opacity: leftOpacity, x: leftX, fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}
              >downside</motion.text>
              <motion.text x="320" y="75" textAnchor="middle"
                className="fill-slate-400 dark:fill-slate-500"
                style={{ opacity: rightOpacity, x: rightX, fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}
              >upside</motion.text>
            </svg>
          </div>

          {/* Label underneath */}
          <motion.p
            style={{ opacity: labelOpacity }}
            className="text-center text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-6 sm:mt-8 tracking-wider uppercase font-medium"
          >
            the most symmetric bet you can make
          </motion.p>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

/* ─── The bets — dealt rather than slid ───────────────────────────
   These two examples used to arrive on a SlideCard, one from the left and one
   from the right, which is the most generic scroll effect on the page and had
   nothing to do with what the cards say.

   The section is about placing small bets, so they are dealt: they come up
   from below at an angle and settle into a loose fanned stack, the way you
   would put two cards down on a table.
   ────────────────────────────────────────────────────────────── */

export { ContrastSection };
