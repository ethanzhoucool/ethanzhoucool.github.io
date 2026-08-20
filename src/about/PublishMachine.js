import { useCallback, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { CATALOGUE, CATALOGUE_TOTAL, CATALOGUE_COUNT, TOP_VIDEO } from '../data/catalogue';
import { FadeInBlock } from './primitives';

/* ─── The catalogue, dealt one video at a time ────────────────────
   Everything else on this page argues that the upside is uncapped and that
   you cannot tell in advance which bet pays. This one makes you find out.

   Each press deals a real view count off my youtube channel — all 255 of
   them, shuffled, without replacement. The median video did 1,900 views and
   the smallest did 22. Somewhere in the deck is 1,500,000, and the whole
   chart collapses around it the moment it lands. That collapse is the
   argument, and the video it belongs to is called "asymmetric risk in jjk
   terms", which I did not plan and cannot improve on.
   ────────────────────────────────────────────────────────────── */

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const fmt = (n) => n.toLocaleString();
const short = (n) => (n >= 1000 ? `${Math.round(n / 1000)}K` : `${n}`);

/* One line of commentary, chosen by what has actually happened so far.
   It never congratulates and never hedges — it just reports the state. */
function readout({ count, best, total, done }) {
  const share = total ? Math.round((best / total) * 100) : 0;
  if (count === 0) return 'press it. each press publishes one of my real videos.';
  if (done) {
    return `that is the whole channel, ${CATALOGUE_COUNT} videos, and ${share}% of it is one upload: "${TOP_VIDEO.title}".`;
  }
  if (best >= TOP_VIDEO.views) {
    return `there it is, and it is ${share}% of everything you just published. that video is called "${TOP_VIDEO.title}". i did not plan that.`;
  }
  if (best >= 250000) return 'that one went. it is still not the biggest one in the deck.';
  if (best >= 90000) return 'a real one. keep going, there is a lot more in there.';
  if (count >= 60) return 'sixty in. the median video here did 1,900 views. this is the boring middle.';
  if (count >= 25) return 'twenty-five in and nothing has changed yet. that is the normal experience.';
  if (count >= 10) return 'ten in. this is roughly where most people stop.';
  if (count >= 4) return 'a couple thousand views each. this is what it actually looks like.';
  return 'that is a normal one.';
}

export default function PublishMachine() {
  const reduce = useReducedMotion();
  const [deck, setDeck] = useState(() => shuffle(CATALOGUE));
  const [drawn, setDrawn] = useState([]);
  const liveRef = useRef(null);

  const publish = useCallback((n = 1) => {
    setDeck((d) => {
      if (!d.length) return d;
      const take = d.slice(0, n);
      setDrawn((prev) => [...prev, ...take]);
      return d.slice(take.length);
    });
  }, []);

  const reset = useCallback(() => {
    setDeck(shuffle(CATALOGUE));
    setDrawn([]);
  }, []);

  const { count, best, total, max } = useMemo(() => {
    const c = drawn.length;
    const t = drawn.reduce((a, b) => a + b, 0);
    const m = c ? Math.max(...drawn) : 0;
    return { count: c, best: m, total: t, max: Math.max(m, 1) };
  }, [drawn]);

  const done = deck.length === 0;
  const line = readout({ count, best, total, done });

  return (
    <div className="px-6">
      <div className="mx-auto max-w-3xl">
        <FadeInBlock>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-card backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60">
            <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800 sm:px-8">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                try it yourself
              </p>
              <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
                every press publishes one of my real videos, in a random order.
                the numbers are the actual view counts.
              </p>
              <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
                youtube only &middot; not instagram or tiktok
              </p>
            </div>

            {/* The chart */}
            <div className="px-6 pt-7 sm:px-8">
              <div
                className="flex items-end gap-px overflow-hidden border-b border-slate-200 dark:border-slate-800"
                style={{ height: 150 }}
              >
                {drawn.length === 0 && (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-sm text-slate-300 dark:text-slate-600">
                      nothing published yet
                    </span>
                  </div>
                )}
                {drawn.map((v, i) => {
                  const isBest = v === best;
                  const h = Math.max(2, (v / max) * 100);
                  return (
                    <motion.div
                      key={i}
                      initial={reduce ? false : { height: 0, opacity: 0 }}
                      animate={{ height: `${h}%`, opacity: 1 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      title={`${fmt(v)} views`}
                      className={`min-w-[1px] flex-1 ${
                        isBest
                          ? 'bg-blue-500 dark:bg-blue-400'
                          : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Readouts */}
              <dl className="mt-5 grid grid-cols-3 gap-4">
                {[
                  ['published', count ? `${count}` : '0'],
                  ['total views', count ? fmt(total) : '0'],
                  ['best one', count ? short(best) : '0'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-slate-400 dark:text-slate-500">{k}</dt>
                    <dd className="mt-0.5 text-2xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-slate-50">
                      {v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Controls */}
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 px-6 py-5 dark:border-slate-800 sm:px-8">
              <button
                type="button"
                onClick={() => publish(1)}
                disabled={done}
                data-hover
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-card transition-all duration-200 hover:shadow-card-hover active:translate-y-px disabled:cursor-default disabled:opacity-40 dark:bg-slate-50 dark:text-slate-900"
              >
                {done ? 'that is the whole channel' : 'publish one'}
              </button>

              {/* Nobody is pressing a button 255 times to finish the point. */}
              {!done && count >= 4 && (
                <button
                  type="button"
                  onClick={() => publish(10)}
                  data-hover
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-white active:translate-y-px dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                >
                  publish ten
                </button>
              )}

              {count > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  data-hover
                  aria-label="Start over"
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  start over
                </button>
              )}

              <span className="ml-auto text-xs tabular-nums text-slate-400 dark:text-slate-500">
                {deck.length} left
              </span>
            </div>

            {/* Commentary */}
            <p
              ref={liveRef}
              aria-live="polite"
              className="border-t border-slate-200 px-6 py-4 text-sm leading-relaxed text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:px-8"
            >
              {line}
            </p>
          </div>
        </FadeInBlock>

        <FadeInBlock>
          <p className="mt-8 text-center text-sm leading-relaxed text-slate-400 dark:text-slate-500">
            {fmt(CATALOGUE_TOTAL)} views across {CATALOGUE_COUNT} videos on youtube
            alone. the median one did 1,900. i could not have told you in advance
            which would be the big one.
          </p>
        </FadeInBlock>
      </div>
    </div>
  );
}
