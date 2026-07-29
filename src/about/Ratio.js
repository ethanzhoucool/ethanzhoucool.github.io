import { useRef } from 'react';
import { motion, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { useNarrativeProgress } from './primitives';

/* ─── The ratio — scroll drives the fraction it is describing ─────
   This section argues that every action should "maximize the ratio of
   results / effort", and the fraction underneath it used to be static text
   inside a plain fade-in, followed by a hard-coded 26rem spacer of dead air.
   The page asked for a lot of scroll here and did nothing with it.

   Now the scroll performs the sentence: results grows, effort shrinks and
   dims, and the dividing rule stretches with the numerator. By the time you
   reach the bottom of the pin, the ratio has visibly been maximised.
   ────────────────────────────────────────────────────────────── */
const RatioSection = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const scrollYProgress = useNarrativeProgress({
    target: ref,
    offset: ['start start', 'end start'],
  }, 0.55);

  const spring = { stiffness: 90, damping: 26 };

  /* h-[210vh] means the sticky child unpins at (2.1 - 1) / 2.1 = 0.52, so every
     beat lands before then. Anything scheduled past that plays while the text
     is already sliding off screen. */
  const introOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);
  const maximizeOpacity = useTransform(scrollYProgress, [0.05, 0.14], [0, 1]);
  const fractionOpacity = useTransform(scrollYProgress, [0.12, 0.2], [0, 1]);

  /* The numerator climbs, the denominator collapses. */
  const resultsScale = useSpring(
    useTransform(scrollYProgress, [0.22, 0.5], [1, 1.75]),
    spring
  );
  const effortScale = useSpring(
    useTransform(scrollYProgress, [0.22, 0.5], [1, 0.55]),
    spring
  );
  const effortOpacity = useTransform(scrollYProgress, [0.22, 0.5], [1, 0.4]);
  const ruleWidth = useSpring(
    useTransform(scrollYProgress, [0.22, 0.5], [140, 260]),
    spring
  );
  const ruleWidthPx = useTransform(ruleWidth, (v) => `${v}px`);

  return (
    <div ref={ref} className="relative h-[210vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 text-center sm:gap-14">
          <motion.p
            style={{ opacity: introOpacity }}
            className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl md:text-2xl"
          >
            Every{' '}
            <motion.span
              /* Freezing the scroll progress does not stop a time-based
                 loop, so this one has to opt out separately. */
              animate={reduce ? undefined : { rotate: [0, -5, 4, -3, 0], y: [0, -4, 2, -2, 0], scale: [1, 1.08, 1.03, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.1, ease: 'easeInOut' }}
              className="inline-block font-semibold text-slate-800 dark:text-slate-100"
            >
              action
            </motion.span>{' '}
            should
          </motion.p>

          <motion.p
            style={{ opacity: maximizeOpacity }}
            className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl md:text-6xl"
          >
            maximize
          </motion.p>

          <motion.div
            style={{ opacity: fractionOpacity }}
            className="flex flex-col items-center gap-6 sm:gap-8"
          >
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500 sm:text-base">
              the ratio of
            </p>

            <div className="inline-flex flex-col items-center leading-none">
              <motion.span
                style={{ scale: resultsScale }}
                className="block origin-bottom text-2xl font-semibold text-slate-800 dark:text-slate-100 sm:text-3xl md:text-4xl"
              >
                results
              </motion.span>

              <motion.span
                style={{ width: ruleWidthPx }}
                className="my-3 block h-px bg-slate-300 dark:bg-slate-600"
              />

              <motion.span
                style={{ scale: effortScale, opacity: effortOpacity }}
                className="block origin-top text-2xl font-semibold text-slate-500 dark:text-slate-400 sm:text-3xl md:text-4xl"
              >
                effort
              </motion.span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

/* ─── Fade-in wrapper — scroll-progress driven ─── */

export { RatioSection };
