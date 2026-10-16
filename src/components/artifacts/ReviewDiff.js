import React from 'react';
import { motion } from 'framer-motion';
import { useLoop, EASE } from './useLoop';

/*
 * atlas-review's overlay mode: the same screen from two builds, one wiped
 * over the other. The handle sweeps, then the tool switches to highlight and
 * boxes the region that actually moved — the part a reviewer would otherwise
 * squint for.
 */
const BEATS = [1700, 1700, 2600];
const MODES = ['overlay', 'overlay', 'highlight'];
const WIPE = [74, 26, 100];

function Screen({ after }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-white px-3 pt-2.5">
      <div className="font-mono text-[7px] uppercase tracking-[0.18em] text-slate-400">checkout</div>
      <div className="mt-2 flex items-center justify-between border-b border-slate-100 pb-1.5">
        <span className="text-[8px] text-slate-600">subtotal</span>
        <span className="font-mono text-[8px] text-slate-700">$42.00</span>
      </div>
      <div className="flex items-center justify-between border-b border-slate-100 py-1.5">
        <span className="text-[8px] text-slate-600">shipping</span>
        <span className="font-mono text-[8px] text-slate-700">$6.50</span>
      </div>
      {after ? (
        <div className="mt-2 flex gap-1.5">
          <div className="flex h-[18px] flex-1 items-center justify-center rounded bg-slate-900 text-[7px] font-medium text-white">
            apple pay
          </div>
          <div className="flex h-[18px] flex-1 items-center justify-center rounded bg-blue-600 text-[7px] font-medium text-white">
            pay $48.50
          </div>
        </div>
      ) : (
        <div className="mt-2 flex h-[18px] items-center justify-center rounded bg-blue-600 text-[7px] font-medium text-white">
          pay $48.50
        </div>
      )}
    </div>
  );
}

export default function ReviewDiff() {
  const { ref, beat } = useLoop(BEATS);
  const mode = MODES[beat];
  const wipe = WIPE[beat];

  return (
    <figure ref={ref} className="m-0 flex w-full max-w-[300px] items-center gap-4">
      <div className="relative h-[150px] w-[118px] flex-none overflow-hidden rounded-[10px] border border-slate-200 shadow-card dark:border-slate-700">
        <Screen />
        {/* The newer build, revealed from the handle rightward. */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ clipPath: `inset(0 0 0 ${100 - wipe}%)` }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <Screen after />
        </motion.div>

        <motion.div
          className="absolute inset-y-0 w-px bg-blue-500"
          initial={false}
          animate={{ left: `${100 - wipe}%` }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <span className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-500 bg-white" />
        </motion.div>

        {/* Highlight mode: the changed region, boxed. */}
        <motion.div
          className="pointer-events-none absolute left-2 right-2 top-[73px] h-[27px] rounded border-[1.5px] border-dashed border-rose-500 bg-rose-500/10"
          initial={false}
          animate={{ scale: mode === 'highlight' ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        />
      </div>

      <div className="min-w-0 flex-1 font-mono text-[10px] leading-[1.9]">
        <div className="text-slate-700 dark:text-slate-200">Checkout</div>
        <div className="whitespace-nowrap text-slate-400 dark:text-slate-500">#4 6149d68 → #5 a1c07be</div>

        <div className="relative mt-2 flex gap-1 rounded-full bg-slate-900/[0.05] p-0.5 dark:bg-slate-100/[0.08]">
          {['overlay', 'highlight'].map((m) => (
            <span key={m} className="relative flex-1 py-0.5 text-center text-[9px]">
              {mode === m && (
                <motion.span
                  layoutId="review-mode"
                  className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-slate-700"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
              <span
                className={`relative ${
                  mode === m ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {m}
              </span>
            </span>
          ))}
        </div>

        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-[15px] font-semibold text-rose-600 dark:text-rose-400">2.8%</span>
          <span className="text-slate-400 dark:text-slate-500">changed</span>
        </div>
        <div className="text-slate-500 dark:text-slate-400">1 region · needs review</div>
      </div>
    </figure>
  );
}
