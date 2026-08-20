import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeInBlock } from './primitives';

/* ─── The fork ────────────────────────────────────────────────────
   A real decision, put to the reader before they are told the answer.
   Both buttons are honest choices; only one of them is what happened.
   ────────────────────────────────────────────────────────────── */
const ANSWER = {
  keep: {
    verdict: 'that is what i did.',
    body:
      'video 41 did 962. the one after that did under a thousand too. the 187,000 one was still a long way off, and there was no signal telling me it was coming. i just had not spent very much to find out.',
  },
  stop: {
    verdict: 'completely reasonable.',
    body:
      'forty tries, nothing to show, and every one of them cost an evening. but the 187,000 video was still in the deck, and stopping is the only move that guarantees you never draw it.',
  },
};

export default function Fork() {
  const [choice, setChoice] = useState(null);

  return (
    <div className="px-6">
      <div className="mx-auto max-w-2xl">
        <FadeInBlock>
          <p className="text-2xl font-medium leading-snug tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
            you have published forty videos. the best one did nine hundred views.
          </p>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            do you keep going?
          </p>
        </FadeInBlock>

        <FadeInBlock>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              ['keep', 'keep going'],
              ['stop', 'stop, it is not working'],
            ].map(([key, label]) => {
              const active = choice === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setChoice(key)}
                  data-hover
                  aria-pressed={active}
                  className={`rounded-full border px-6 py-3 text-sm font-medium transition-all duration-200 active:translate-y-px ${
                    active
                      ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-50 dark:bg-slate-50 dark:text-slate-900'
                      : 'border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-white dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-900'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </FadeInBlock>

        <AnimatePresence mode="wait">
          {choice && (
            <motion.div
              key={choice}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 border-l-2 border-blue-500 pl-5 dark:border-blue-400"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
                {ANSWER[choice].verdict}
              </p>
              <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                {ANSWER[choice].body}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
