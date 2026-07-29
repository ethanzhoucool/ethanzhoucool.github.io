import { useRef } from 'react';
import { motion, useTransform, useReducedMotion } from 'framer-motion';
import { useNarrativeProgress } from './primitives';

/* ─── Asymmetry — a payoff curve, drawn by scrolling ──────────────
   This beat used to be two boxes with a word in each, which meant the page
   described the shape of an asymmetric bet entirely in prose. That shape has
   a picture, and it is the picture Ethan's finance audience already reads.

   The floor is capped and short, so it draws almost instantly. The upside is
   unbounded, so it keeps climbing and runs off the top of the frame. The two
   halves are literally given different amounts of scroll, which is the whole
   argument in one gesture.
   ────────────────────────────────────────────────────────────── */
const AsymmetrySection = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const scrollYProgress = useNarrativeProgress({
    target: ref,
    offset: ['start start', 'end start'],
  }, 0.5);

  /* h-[190vh] unpins at (1.9 - 1) / 1.9 = 0.47. Everything lands by 0.44. */
  const introOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  const chartOpacity = useTransform(scrollYProgress, [0.06, 0.14], [0, 1]);
  const axisOpacity = useTransform(scrollYProgress, [0.1, 0.16], [0, 1]);

  /* Capped loss: a short flat run, over in a moment. */
  const floorDraw = useTransform(scrollYProgress, [0.16, 0.22], [0, 1]);
  const floorLabel = useTransform(scrollYProgress, [0.2, 0.26], [0, 1]);

  /* Uncapped gain: takes four times the scroll and leaves the frame. */
  const riseDraw = useTransform(scrollYProgress, [0.24, 0.44], [0, 1]);
  const fillOpacity = useTransform(scrollYProgress, [0.3, 0.44], [0, 1]);
  const riseLabel = useTransform(scrollYProgress, [0.38, 0.44], [0, 1]);

  const still = reduce ? 1 : undefined;

  return (
    <div ref={ref} className="relative h-[190vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center px-6">
        <div className="mx-auto w-full max-w-3xl">
          <motion.div style={{ opacity: reduce ? 1 : introOpacity }}>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500 sm:text-base">
              asymmetry matters
            </p>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl">
              It&apos;s about placing
              <span className="mx-2 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200 sm:text-base">
                small bets
              </span>
              where the
            </p>
          </motion.div>

          <motion.div style={{ opacity: still ?? chartOpacity }} className="mt-8">
            <svg
              viewBox="0 0 460 300"
              className="w-full overflow-visible"
              role="img"
              aria-label="A payoff curve. The loss is capped at a shallow floor; the gain rises without limit and leaves the top of the frame."
            >
              <defs>
                <linearGradient id="upsideFill" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="rgb(37,99,235)" stopOpacity="0.02" />
                  <stop offset="100%" stopColor="rgb(37,99,235)" stopOpacity="0.22" />
                </linearGradient>
                <linearGradient id="riseStroke" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgb(96,165,250)" />
                  <stop offset="100%" stopColor="rgb(37,99,235)" />
                </linearGradient>
              </defs>

              {/* Break-even line */}
              <motion.line
                x1="18" y1="196" x2="452" y2="196"
                strokeWidth="1"
                strokeDasharray="3 5"
                className="stroke-slate-300 dark:stroke-slate-600"
                style={{ opacity: still ?? axisOpacity }}
              />
              <motion.text
                x="452" y="188" textAnchor="end"
                className="fill-slate-400 dark:fill-slate-500"
                style={{ opacity: still ?? axisOpacity, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase' }}
              >
                break even
              </motion.text>

              {/* Area under the upside */}
              <motion.path
                d="M 186 238 C 258 232, 338 140, 438 2 L 438 238 Z"
                fill="url(#upsideFill)"
                style={{ opacity: still ?? fillOpacity }}
              />

              {/* Capped floor */}
              <motion.path
                d="M 22 238 L 186 238"
                fill="none"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="stroke-slate-400 dark:stroke-slate-500"
                style={{ pathLength: still ?? floorDraw }}
              />

              {/* The cap itself */}
              <motion.path
                d="M 22 226 L 22 250"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                className="stroke-slate-400 dark:stroke-slate-500"
                style={{ opacity: still ?? floorLabel }}
              />

              {/* Uncapped rise, running off the top edge */}
              <motion.path
                d="M 186 238 C 258 232, 338 140, 438 2"
                fill="none"
                stroke="url(#riseStroke)"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ pathLength: still ?? riseDraw }}
              />

              {/* Labels */}
              <motion.g style={{ opacity: still ?? floorLabel }}>
                <text
                  x="30" y="272"
                  className="fill-slate-400 dark:fill-slate-500"
                  style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase' }}
                >
                  downside
                </text>
                <text
                  x="30" y="292"
                  className="fill-slate-600 dark:fill-slate-300"
                  style={{ fontSize: '19px', fontWeight: 600 }}
                >
                  negligible
                </text>
              </motion.g>

              {/* Upper left, mirroring the downside labels at lower left, so the
                  two sit on the axis they describe. Anywhere nearer the curve
                  and the stroke runs straight through the word. */}
              <motion.g style={{ opacity: still ?? riseLabel }}>
                <text
                  x="26" y="74"
                  className="fill-blue-500 dark:fill-blue-300"
                  style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase' }}
                >
                  upside
                </text>
                <text
                  x="24" y="116"
                  className="fill-blue-700 dark:fill-blue-300"
                  style={{ fontSize: '36px', fontWeight: 600, letterSpacing: '-0.02em' }}
                >
                  enormous
                </text>
              </motion.g>
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

/* ─── "everywhere" — the word does what the sentence claims ───────
   This beat used to be a single centred line fading in on an otherwise
   empty screen, which is the least the page does with a whole viewport.

   The sentence says these opportunities are everywhere, so the word
   multiplies: copies push outward from the centre as you scroll, at
   varying depth, until the screen is full of them. The claim is made by
   the layout rather than asserted by the copy.
   ────────────────────────────────────────────────────────────── */

/* Deterministic hash so the scatter is identical on every render and every
   reload. Math.random here would reshuffle on each paint. */

export { AsymmetrySection };
