import React from 'react';
import { motion } from 'framer-motion';
import { useLoop } from './useLoop';

/*
 * atlas-pr-diff's actual output: the sticky comment it leaves on a pull
 * request. Rendered as the comment rather than described, because anyone who
 * has reviewed a mobile PR recognises the genre on sight.
 *
 * In motion, a reviewer's eye walks it: each row lights in turn, then the
 * verdict line. At rest nothing is lit and the comment reads as posted.
 */
const ROWS = [
  ['+', 'Checkout / Apple Pay', 'new screen', 'untested'],
  ['~', 'Cart', '3 elements moved', 'covered'],
  ['−', 'Promo code modal', 'removed', 'n/a'],
];

const BEATS = [1300, 1300, 1300, 1600, 1400];
const TINT = 'rgba(59, 130, 246, 0.09)';
const CLEAR = 'rgba(59, 130, 246, 0)';

export default function BotComment() {
  const { ref, beat } = useLoop(BEATS, { restAt: 4 });
  return (
    <figure ref={ref} className="m-0 overflow-hidden rounded-card border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/60">
        <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-slate-900 font-mono text-[8px] font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
          A
        </span>
        <span className="whitespace-nowrap font-mono text-[10px] text-slate-700 dark:text-slate-200">
          atlas-pr-diff
        </span>
        <span className="rounded-sm border border-slate-300 px-1 font-mono text-[8px] uppercase tracking-wide text-slate-400 dark:border-slate-600 dark:text-slate-500">
          bot
        </span>
        <span className="whitespace-nowrap font-mono text-[10px] text-slate-400 dark:text-slate-500">
          on #482
        </span>
        <span className="ml-auto font-mono text-[9px] text-slate-400 dark:text-slate-500">
          edited
        </span>
      </div>

      <div className="px-3 py-3">
        <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
          screen graph: <span className="text-emerald-600 dark:text-emerald-400">+1</span>{' '}
          <span className="text-rose-600 dark:text-rose-400">−1</span>{' '}
          <span className="text-slate-400 dark:text-slate-500">~1</span>
        </div>

        <table className="mt-2 w-full border-collapse">
          <tbody>
            {ROWS.map(([sign, screen, change, cover], i) => (
              <motion.tr
                key={screen}
                initial={false}
                animate={{ backgroundColor: beat === i ? TINT : CLEAR }}
                transition={{ duration: 0.35 }}
                className="border-t border-slate-100 align-top dark:border-slate-800"
              >
                <td
                  className={`w-4 py-1.5 pr-1 font-mono text-[11px] ${
                    sign === '+'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : sign === '−'
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {sign}
                </td>
                <td className="py-1.5 pr-2 font-mono text-[11px] text-slate-700 dark:text-slate-200">
                  {screen}
                </td>
                <td className="py-1.5 pr-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  {change}
                </td>
                <td className="py-1.5 text-right font-mono text-[10px] uppercase tracking-wide">
                  <span
                    className={
                      cover === 'untested'
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-400 dark:text-slate-500'
                    }
                  >
                    {cover}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        <motion.div
          className="mt-2 border-t border-slate-100 pt-2 font-mono text-[10px] dark:border-slate-800"
          initial={false}
          animate={{ color: beat === 3 ? '#e11d48' : '#94a3b8' }}
          transition={{ duration: 0.35 }}
        >
          1 flow reachable in this build has no test.
        </motion.div>
      </div>
    </figure>
  );
}
