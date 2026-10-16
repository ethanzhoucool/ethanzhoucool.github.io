import React, { useEffect } from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { useLoop, SPRING } from './useLoop';

/* device-gif-maker's output is a device frame, so the artifact is one: the
   pristine frame it renders, holding the flow it just recorded. In motion it
   plays that flow back — tap, next screen, tap, loop — with the frame counter
   running, which is what a looping gif is. */
const BEATS = [1300, 1300, 1300];
const FRAMES = 118;

export default function DeviceGif() {
  const { ref, beat, reduced } = useLoop(BEATS, { restAt: 0 });
  const frame = useMotionValue(41);
  const label = useTransform(frame, (f) => `${String(Math.round(f)).padStart(3, '0')}/${FRAMES}`);

  useEffect(() => {
    if (reduced) return undefined;
    const from = Math.round((beat / BEATS.length) * FRAMES) + 1;
    const to = Math.round(((beat + 1) / BEATS.length) * FRAMES);
    const controls = animate(frame, [from, to], { duration: BEATS[beat] / 1000, ease: 'linear' });
    return () => controls.stop();
  }, [beat, frame, reduced]);

  return (
    <figure ref={ref} className="m-0 flex items-center justify-center gap-5">
      <div className="w-[92px]">
        <div className="rounded-[15px] bg-slate-950 p-[4px] shadow-card">
          <div className="relative aspect-[9/17] overflow-hidden rounded-[11px] bg-white">
            {/* Three screens of the flow, side by side, slid through. */}
            <motion.div
              className="absolute inset-y-0 left-0 flex w-[300%]"
              initial={false}
              animate={{ x: `${(-100 / 3) * beat}%` }}
              transition={SPRING}
            >
              <div className="flex w-1/3 flex-col items-center justify-center gap-2">
                <div className="h-6 w-6 rounded-full border border-slate-300" />
                <div className="h-1.5 w-11 rounded-full bg-slate-200" />
                <div className="h-1.5 w-7 rounded-full bg-slate-200" />
              </div>
              <div className="flex w-1/3 flex-col justify-center gap-1.5 px-2.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="h-4 w-4 rounded bg-slate-200" />
                    <div className="h-1.5 flex-1 rounded-full bg-slate-200" />
                  </div>
                ))}
              </div>
              <div className="flex w-1/3 flex-col items-center justify-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                  ✓
                </div>
                <div className="h-1.5 w-9 rounded-full bg-slate-200" />
              </div>
            </motion.div>

            {/* The tap that moves the flow on. */}
            {!reduced && (
              <motion.span
                key={beat}
                className="absolute left-1/2 top-[62%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/30"
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [0.3, 1, 1.4], opacity: [0, 1, 0] }}
                transition={{ duration: 0.7, delay: BEATS[beat] / 1000 - 0.75, ease: 'easeOut' }}
              />
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-slate-200 bg-slate-50 px-2 py-1">
              <span className="font-mono text-[8px] text-slate-400">frame</span>
              <motion.span className="font-mono text-[8px] tabular-nums text-slate-400">
                {label}
              </motion.span>
            </div>
          </div>
        </div>
      </div>

      <dl className="font-mono text-[10px] leading-[1.9]">
        {[
          ['out', 'checkout.gif'],
          ['size', '1.4 MB'],
          ['frames', '118 · loops'],
          ['trimmed', 'dead frames cut'],
        ].map(([k, v]) => (
          <div key={k} className="flex gap-3">
            <dt className="w-12 text-slate-400 dark:text-slate-500">{k}</dt>
            <dd className="text-slate-600 dark:text-slate-300">{v}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
