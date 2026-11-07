import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoop, SPRING } from './useLoop';

/*
 * mobile-bisect, searching.
 *
 * Sixteen commits between a known-good tag and a broken HEAD. Each beat is
 * one run on a cloud device: the probe lands on the midpoint, the flow passes
 * or fails, and the bracket halves. Four runs, one commit. The shas are made
 * up, like the ones in the repo's own scripted demo.
 */
const N = 16;
const STEPS = [
  { lo: 0, hi: 15, probe: null, verdict: null, line: '16 commits · good v1.4.0 · bad HEAD' },
  { lo: 8, hi: 15, probe: 7, verdict: 'good', line: 'run 1 · a3f9e02 · checkout passes' },
  { lo: 8, hi: 11, probe: 11, verdict: 'bad', line: 'run 2 · 8d4c2f1 · stuck after /orders' },
  { lo: 10, hi: 11, probe: 9, verdict: 'good', line: 'run 3 · 51be7a0 · checkout passes' },
  { lo: 11, hi: 11, probe: 10, verdict: 'good', line: 'run 4 · c02d9e4 · checkout passes' },
  { lo: 11, hi: 11, probe: 11, verdict: 'bad', line: 'first bad commit · 8d4c2f1', done: true },
];
const BEATS = [1600, 1500, 1500, 1500, 1500, 3000];

/* Results so far, so a verdict stays painted after the probe moves on. */
function marksAt(beat) {
  const m = { 0: 'good', [N - 1]: 'bad' };
  for (let i = 1; i <= beat; i += 1) {
    const s = STEPS[i];
    if (s.probe !== null) m[s.probe] = s.verdict;
  }
  return m;
}

const pct = (i) => ((i + 0.5) / N) * 100;

export default function Bisect() {
  const { ref, beat } = useLoop(BEATS);
  const step = STEPS[beat];
  const marks = marksAt(beat);

  return (
    <figure ref={ref} className="m-0 w-full max-w-[300px]">
      <div className="relative h-[70px]">
        {/* The probe: where the device is running right now. */}
        {step.probe !== null && (
          <motion.div
            className="absolute top-0 -translate-x-1/2 font-mono text-[9px] text-slate-500 dark:text-slate-400"
            initial={false}
            animate={{ left: `${pct(step.probe)}%` }}
            transition={SPRING}
          >
            <div className="flex flex-col items-center">
              <span className="flex h-[22px] w-[13px] items-end justify-center rounded-[3px] border border-slate-400 pb-[2px] dark:border-slate-500">
                <span className="h-[2px] w-[5px] rounded-full bg-slate-400 dark:bg-slate-500" />
              </span>
              <span className="mt-0.5">▾</span>
            </div>
          </motion.div>
        )}

        {/* The bracket: what is still suspect. */}
        <motion.div
          className="absolute top-[38px] h-[24px] rounded-full border border-blue-500/60 bg-blue-500/[0.07] dark:border-blue-400/60 dark:bg-blue-400/[0.08]"
          initial={false}
          animate={{
            left: `calc(${(step.lo / N) * 100}% + 1px)`,
            width: `calc(${((step.hi - step.lo + 1) / N) * 100}% - 2px)`,
          }}
          transition={SPRING}
        />

        {/* Commits */}
        <div className="absolute inset-x-0 top-[44px] flex">
          {Array.from({ length: N }, (_, i) => {
            const m = marks[i];
            const culprit = step.done && i === step.lo;
            return (
              <div key={i} className="flex flex-1 justify-center">
                <motion.span
                  className={`block h-3 w-3 rounded-full border ${
                    m === 'good'
                      ? 'border-emerald-500 bg-emerald-500'
                      : m === 'bad'
                        ? 'border-rose-500 bg-rose-500'
                        : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-900'
                  }`}
                  initial={false}
                  animate={{ scale: culprit ? 1.45 : step.probe === i ? 1.2 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between font-mono text-[9px] text-slate-400 dark:text-slate-500">
        <span>v1.4.0</span>
        <span>HEAD</span>
      </div>

      {/* The terminal line. Swaps in place; the first render is not animated. */}
      <div className="mt-3 h-[30px] overflow-hidden rounded-chip border border-slate-200 bg-white px-2.5 dark:border-slate-700 dark:bg-slate-900">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={beat}
            className={`flex h-[28px] items-center font-mono text-[10px] ${
              step.done
                ? 'font-semibold text-rose-600 dark:text-rose-400'
                : 'text-slate-600 dark:text-slate-300'
            }`}
            initial={{ y: 18 }}
            animate={{ y: 0 }}
            exit={{ y: -18 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="mr-1.5 text-slate-400">$</span>
            {step.line}
          </motion.div>
        </AnimatePresence>
      </div>
    </figure>
  );
}
