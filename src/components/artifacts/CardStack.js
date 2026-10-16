import React, { useEffect } from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { useLoop } from './useLoop';

/*
 * Lumen's wallet screen: the depth-stacked deck of reward cards you drag to
 * cycle, and the cashback balance that counts up when one is claimed. Two of
 * the animations the app exists to make UI tests trip on, running the way the
 * app runs them.
 */
const CARDS = [
  { name: 'groceries', rate: '5%', from: '#6366f1', to: '#a855f7', earned: 2.4 },
  { name: 'transit', rate: '3%', from: '#f59e0b', to: '#f43f5e', earned: 1.15 },
  { name: 'coffee', rate: '8%', from: '#10b981', to: '#0ea5e9', earned: 0.85 },
];
const BEATS = [2000, 2000, 2000];
const START = 48.2;

/* Where each depth sits. The deck reads as three cards, not one. */
const DEPTH = [
  { y: 0, scale: 1, zIndex: 3 },
  { y: -9, scale: 0.93, zIndex: 2 },
  { y: -18, scale: 0.86, zIndex: 1 },
];

export default function CardStack() {
  const { ref, beat, reduced } = useLoop(BEATS, { restAt: 0 });

  /* The balance is a motion value rendered straight into the DOM, so the
     count-up never re-renders the deck. */
  const balance = useMotionValue(START);
  const text = useTransform(balance, (v) => `$${v.toFixed(2)}`);

  useEffect(() => {
    if (reduced) return undefined;
    const total =
      START + CARDS.slice(0, beat).reduce((sum, c) => sum + c.earned, 0);
    const controls = animate(balance, beat === 0 ? START : total, {
      duration: beat === 0 ? 0.6 : 0.9,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [beat, balance, reduced]);

  return (
    <figure ref={ref} className="m-0 flex w-full max-w-[300px] items-center gap-5">
      <div className="relative h-[110px] w-[150px] flex-none">
        {CARDS.map((c, i) => {
          const depth = (i - beat + CARDS.length) % CARDS.length;
          const leaving = depth === CARDS.length - 1;
          return (
            <motion.div
              key={c.name}
              className="absolute inset-x-0 bottom-0 h-[88px] rounded-xl p-3 text-white shadow-card"
              style={{
                backgroundImage: `linear-gradient(135deg, ${c.from}, ${c.to})`,
                zIndex: DEPTH[depth].zIndex,
                transformOrigin: '50% 0%',
              }}
              initial={false}
              animate={{
                y: DEPTH[depth].y,
                scale: DEPTH[depth].scale,
                /* The swipe: out to the right, tilt, tuck behind. */
                x: leaving && !reduced ? [0, 120, 0] : 0,
                rotate: leaving && !reduced ? [0, 9, 0] : 0,
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-semibold uppercase tracking-[0.16em]">lumen</span>
                <span className="font-mono text-[9px]">{c.rate}</span>
              </div>
              <div className="mt-6 text-[11px] font-medium">{c.name}</div>
              <div className="font-mono text-[8px] text-white/80">•••• 2041</div>
            </motion.div>
          );
        })}
      </div>

      <div className="min-w-0 font-mono text-[10px] leading-[1.9]">
        <div className="text-slate-400 dark:text-slate-500">cashback</div>
        <motion.div className="font-sans text-[22px] font-semibold leading-tight tracking-tight text-slate-900 tabular-nums dark:text-slate-50">
          {text}
        </motion.div>
        <div className="mt-2 text-slate-500 dark:text-slate-400">drag to cycle</div>
        <div className="text-slate-400 dark:text-slate-500">18 animations</div>
      </div>
    </figure>
  );
}
