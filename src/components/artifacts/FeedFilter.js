import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoop, EASE } from './useLoop';

/*
 * X Launch Filter, on the home timeline. The feed arrives whole, then
 * everything without reach or a launch signal is cut out of it — collapsed,
 * not faded, because the real extension removes posts from the API response
 * and the timeline is simply shorter. The pill in the corner is the only UI.
 */
const POSTS = [
  { text: 'v2 is live. here is what changed', views: '1.4M', pass: true },
  { text: 'gm, coffee first', views: '3.1k', pass: false },
  { text: 'hot take on standups', views: '9.8k', pass: false },
  { text: 'we just shipped agents to everyone', views: '860k', pass: true },
  { text: 'introducing the new api, out today', views: '2.2M', pass: true },
];
const BEATS = [1900, 3200];

export default function FeedFilter() {
  const { ref, beat } = useLoop(BEATS);
  const filtering = beat === 1;
  const kept = POSTS.filter((p) => p.pass).length;

  return (
    <figure ref={ref} className="m-0 w-full max-w-[290px]">
      <div className="overflow-hidden rounded-card border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        {POSTS.map((p) => {
          const gone = filtering && !p.pass;
          return (
            <motion.div
              key={p.text}
              className="overflow-hidden"
              initial={false}
              animate={{ height: gone ? 0 : 'auto' }}
              transition={{ duration: 0.45, ease: EASE, delay: gone ? POSTS.indexOf(p) * 0.04 : 0 }}
            >
              <div className="flex items-center gap-2 border-b border-slate-100 px-2.5 py-[5px] dark:border-slate-800">
                <span className="h-4 w-4 flex-none rounded-full bg-slate-200 dark:bg-slate-700" />
                <span className="min-w-0 flex-1 truncate text-[10px] text-slate-700 dark:text-slate-300">
                  {p.text}
                </span>
                <span
                  className={`font-mono text-[9px] transition-colors duration-300 ${
                    filtering && p.pass
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {p.views}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* The pill. It reports outcomes, never settings. */}
      <motion.div
        layout
        className="mt-2.5 inline-flex h-[22px] items-center overflow-hidden rounded-full bg-slate-900 px-2.5 font-mono text-[9px] text-white dark:bg-slate-100 dark:text-slate-900"
        transition={{ type: 'spring', stiffness: 400, damping: 34 }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={filtering ? 'on' : 'off'}
            initial={{ y: 14 }}
            animate={{ y: 0 }}
            exit={{ y: -14 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            {filtering ? `Home · ${kept} of ${POSTS.length}` : 'Home · watching…'}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </figure>
  );
}
