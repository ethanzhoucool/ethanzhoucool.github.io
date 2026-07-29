import { useRef } from 'react';
import { motion, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { useNarrativeProgress } from './primitives';

/* ─── The bets — dealt rather than slid ───────────────────────────
   These two examples used to arrive on a SlideCard, one from the left and one
   from the right, which is the most generic scroll effect on the page and had
   nothing to do with what the cards say.

   The section is about placing small bets, so they are dealt: they come up
   from below at an angle and settle into a loose fanned stack, the way you
   would put two cards down on a table.
   ────────────────────────────────────────────────────────────── */
const BETS = [
  {
    action: 'Send an email to someone you admire.',
    worst: 'they ignore it.',
    best: 'it changes your career.',
    from: { y: 190, rotate: -9 },
    to: { rotate: -2.2 },
  },
  {
    action: 'Publish your ideas online.',
    worst: 'no one reads them.',
    best: 'the right person does.',
    from: { y: 230, rotate: 9 },
    to: { rotate: 2.4 },
  },
];

const DealtBet = ({ bet, i, progress, reduce }) => {
  const start = 0.08 + i * 0.13;
  const end = start + 0.2;
  const settle = { stiffness: 110, damping: 18 };

  const y = useSpring(useTransform(progress, [start, end], [bet.from.y, 0]), settle);
  const rotate = useSpring(
    useTransform(progress, [start, end], [bet.from.rotate, bet.to.rotate]),
    settle
  );
  const opacity = useTransform(progress, [start, start + 0.07], [0, 1]);

  const style = reduce ? {} : { y, rotate, opacity };

  return (
    <motion.div
      style={style}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800/60 sm:p-8"
    >
      <p className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100 sm:mb-5 sm:text-xl">
        {bet.action}
      </p>
      <div className="space-y-2 sm:space-y-3">
        <p className="flex items-start gap-3">
          <span className="text-lg text-slate-300 dark:text-slate-600 sm:text-xl">↓</span>
          <span>
            <span className="font-semibold text-slate-400 dark:text-slate-500">Worst case:</span>{' '}
            <span className="text-slate-500 dark:text-slate-400">{bet.worst}</span>
          </span>
        </p>
        <p className="flex items-start gap-3">
          <span className="text-lg text-blue-500 dark:text-blue-400 sm:text-xl">↑</span>
          <span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Best case:</span>{' '}
            <span className="font-medium text-slate-800 dark:text-slate-100">{bet.best}</span>
          </span>
        </p>
      </div>
    </motion.div>
  );
};

const DealtBets = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const scrollYProgress = useNarrativeProgress({
    target: ref,
    offset: ['start start', 'end start'],
  }, 0.5);

  /* h-[180vh] unpins at (1.8 - 1) / 1.8 = 0.44; the second card lands by 0.41. */
  return (
    <div ref={ref} className="relative h-[180vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center px-6">
        <div className="mx-auto w-full max-w-2xl space-y-5 sm:space-y-6">
          {BETS.map((bet, i) => (
            <DealtBet key={bet.action} bet={bet} i={i} progress={scrollYProgress} reduce={reduce} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Asymmetry — a payoff curve, drawn by scrolling ──────────────
   This beat used to be two boxes with a word in each, which meant the page
   described the shape of an asymmetric bet entirely in prose. That shape has
   a picture, and it is the picture Ethan's finance audience already reads.

   The floor is capped and short, so it draws almost instantly. The upside is
   unbounded, so it keeps climbing and runs off the top of the frame. The two
   halves are literally given different amounts of scroll, which is the whole
   argument in one gesture.
   ────────────────────────────────────────────────────────────── */

export { DealtBets };
