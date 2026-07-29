import { useRef, useMemo } from 'react';
import { motion, useTransform, useReducedMotion } from 'framer-motion';
import { useNarrativeProgress } from './primitives';

/* ─── "everywhere" — the word does what the sentence claims ───────
   This beat used to be a single centred line fading in on an otherwise
   empty screen, which is the least the page does with a whole viewport.

   The sentence says these opportunities are everywhere, so the word
   multiplies: copies push outward from the centre as you scroll, at
   varying depth, until the screen is full of them.
   ────────────────────────────────────────────────────────────── */

/* Deterministic hash so the scatter is identical on every render and every
   reload. Math.random here would reshuffle on each paint. */
const scatter = (i, salt) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const EverywhereCopy = ({ i, progress, reduce }) => {
  const angle = scatter(i, 1) * Math.PI * 2;
  const dist = 26 + scatter(i, 2) * 34; // vw/vh from centre
  const rot = (scatter(i, 3) - 0.5) * 34;
  const scale = 0.4 + scatter(i, 4) * 0.55;
  const peak = 0.1 + scatter(i, 5) * 0.32;

  /* Each copy launches on its own beat, so they arrive as a spray rather
     than all at once. */
  const start = 0.16 + (i / 16) * 0.24;
  const end = start + 0.16;

  const x = useTransform(progress, [start, end], [0, Math.cos(angle) * dist]);
  const y = useTransform(progress, [start, end], [0, Math.sin(angle) * dist]);
  const opacity = useTransform(progress, [start, start + 0.06, end + 0.05], [0, peak, peak]);
  const s = useTransform(progress, [start, end], [0.25, scale]);

  const xv = useTransform(x, (v) => `${v}vw`);
  const yv = useTransform(y, (v) => `${v}vh`);

  if (reduce) return null;

  return (
    <motion.span
      aria-hidden="true"
      style={{ x: xv, y: yv, opacity, scale: s, rotate: rot }}
      className="pointer-events-none absolute select-none whitespace-nowrap font-playfair italic text-2xl text-slate-500 dark:text-slate-400 sm:text-3xl md:text-4xl"
    >
      everywhere
    </motion.span>
  );
};

const EverywhereSection = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const scrollYProgress = useNarrativeProgress({
    target: ref,
    offset: ['start start', 'end start'],
  }, 0.5);

  /* h-[190vh] unpins at (1.9 - 1) / 1.9 = 0.47, so the spray lands before then. */
  const lineOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const lineScale = useTransform(scrollYProgress, [0.16, 0.45], [1, 0.9]);

  const copies = useMemo(() => Array.from({ length: 16 }, (_, i) => i), []);

  return (
    <div ref={ref} className="relative h-[190vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        <div className="relative flex items-center justify-center">
          {copies.map((i) => (
            <EverywhereCopy key={i} i={i} progress={scrollYProgress} reduce={reduce} />
          ))}

          <motion.p
            style={{ opacity: lineOpacity, scale: lineScale }}
            className="relative z-10 max-w-2xl text-center text-xl leading-relaxed text-slate-700 dark:text-slate-200 sm:text-2xl md:text-3xl"
          >
            The strange thing is that these opportunities are{' '}
            <span className="font-playfair italic text-slate-900 dark:text-slate-50">
              everywhere
            </span>
            .
          </motion.p>
        </div>
      </div>
    </div>
  );
};

/* ─── The ratio — scroll drives the fraction it is describing ─────
   This section argues that every action should "maximize the ratio of
   results / effort", and the fraction underneath it used to be static text
   inside a plain fade-in, followed by a hard-coded 26rem spacer of dead air.
   The page asked for a lot of scroll here and did nothing with it.

   Now the scroll performs the sentence: results grows, effort shrinks and
   dims, and the dividing rule stretches with the numerator. By the time you
   reach the bottom of the pin, the ratio has visibly been maximised.
   ────────────────────────────────────────────────────────────── */

export { EverywhereSection };
