import React, { useEffect, useReducer, useRef, useState } from 'react';

/*
 * redaction-checker, running.
 *
 * A scripted pointer backgrounds a banking app, ios snapshots the screen for
 * the switcher, and the balance is still legible in that snapshot — the real
 * MASVS-STORAGE-9 failure the tool exists to catch. Then the fixed build.
 *
 * Built in DOM rather than shipped as a video: it stays sharp at any size,
 * weighs nothing, and the text inside it is real text.
 */
const BEATS = [
  { id: 'idle',  ms: 2200, cursor: [50, 62], verdict: null,   caption: 'app open · balance on screen' },
  { id: 'swipe', ms: 900,  cursor: [50, 96], verdict: null,   caption: 'user swipes up to background the app' },
  { id: 'snap',  ms: 1500, cursor: [50, 96], verdict: null,   caption: 'ios snapshots the screen for the switcher' },
  { id: 'leak',  ms: 3200, cursor: [50, 96], verdict: 'FAIL', caption: 'the snapshot is not redacted — the balance is still legible' },
  { id: 'fixed', ms: 3200, cursor: [50, 96], verdict: 'PASS', caption: 'after the fix — the app masks the screen before it backgrounds' },
];

const next = (i) => (i + 1) % BEATS.length;

function useBeats(paused) {
  const [i, advance] = useReducer(next, 0);
  useEffect(() => {
    if (paused) return undefined;
    const t = setTimeout(advance, BEATS[i].ms);
    return () => clearTimeout(t);
  }, [i, paused]);
  return i;
}

/* Plausible in every digit. A scan report is only interesting if the thing it
   scanned looks like something worth protecting. */
function BankScreen({ masked }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col bg-white transition-[filter] duration-300 ${
        masked ? 'blur-[9px]' : ''
      }`}
    >
      <div className="flex items-center justify-between px-4 pb-2 pt-3">
        <span className="font-mono text-[9px] text-slate-400">9:41</span>
        <span className="font-mono text-[9px] text-slate-400">LTE</span>
      </div>

      <div className="px-4">
        <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-slate-400">
          chequing
        </div>
        <div className="mt-1 flex items-baseline gap-0.5">
          <span className="text-[26px] font-semibold leading-none tracking-tight text-slate-900">
            $12,480
          </span>
          <span className="text-[15px] font-semibold leading-none text-slate-500">.32</span>
        </div>
        <div className="mt-1 font-mono text-[8px] text-slate-400">**** 4417</div>
      </div>

      <div className="mt-4 flex-1 border-t border-slate-200">
        {[
          ['loblaws', '−48.21'],
          ['payroll · acme', '+2,140.00'],
          ['ttc monthly', '−156.00'],
          ['spotify', '−11.99'],
        ].map(([label, amt]) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-slate-100 px-4 py-[7px]"
          >
            <span className="text-[9px] text-slate-600">{label}</span>
            <span
              className={`font-mono text-[9px] ${
                amt.startsWith('+') ? 'text-emerald-600' : 'text-slate-700'
              }`}
            >
              {amt}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* In the leaking build the switcher card is the live screen. In the fixed
   build the app swaps in a masked snapshot before it backgrounds. */
function SwitcherScreen({ masked, flagged }) {
  return (
    <div className="absolute inset-0 bg-slate-950 px-3 pb-3 pt-6">
      <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-slate-500">
        recent apps
      </div>
      <div className="relative mt-2 h-[74%] overflow-hidden rounded border border-slate-700">
        <BankScreen masked={masked} />
        {flagged && <div className="absolute inset-0 bg-rose-500/10 ring-1 ring-inset ring-rose-500" />}
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            flagged ? 'bg-rose-400' : 'bg-emerald-400'
          }`}
        />
        <span className="font-mono text-[8px] text-slate-500">
          {flagged ? 'balance legible' : 'masked'}
        </span>
      </div>
    </div>
  );
}

export default function PhoneScan({ className = '' }) {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const hostRef = useRef(null);

  /* Off-screen and reduced-motion both stop the loop. Reduced motion pins it to
     the beat that carries the point on its own. */
  useEffect(() => {
    const m =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;
    if (m?.matches) setReduced(true);
    const host = hostRef.current;
    if (!host || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting));
    io.observe(host);
    return () => io.disconnect();
  }, []);

  const i = useBeats(paused || reduced);
  const beat = reduced ? BEATS[3] : BEATS[i];
  const inSwitcher = ['snap', 'leak', 'fixed'].includes(beat.id);
  const fixed = beat.id === 'fixed';

  return (
    <figure ref={hostRef} className={`m-0 ${className}`}>
      <div className="relative mx-auto h-[400px] w-[198px] rounded-[26px] bg-slate-950 p-[5px] shadow-card-hover ring-1 ring-slate-900/10">
        <div className="relative h-full w-full overflow-hidden rounded-[21px] bg-white">
          {inSwitcher ? (
            <SwitcherScreen masked={fixed} flagged={!fixed} />
          ) : (
            <BankScreen masked={false} />
          )}

          <div className="absolute bottom-[5px] left-1/2 h-[3px] w-16 -translate-x-1/2 rounded-full bg-slate-900/25" />

          {/* Scripted pointer. The visitor's own cursor is never touched. */}
          {!reduced && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-slate-900/70 transition-all duration-[420ms]"
              style={{ left: `${beat.cursor[0]}%`, top: `${beat.cursor[1]}%` }}
            />
          )}
        </div>
      </div>

      {/* The finding, as the tool would print it. Neutral until there is
          actually something to report. */}
      <figcaption
        className={`mx-auto mt-5 max-w-[280px] border-l-2 pl-3 transition-colors duration-300 ${
          beat.verdict === 'PASS'
            ? 'border-emerald-500'
            : beat.verdict === 'FAIL'
              ? 'border-rose-500'
              : 'border-slate-700'
        }`}
      >
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em]">
          <span
            className={
              beat.verdict === 'PASS'
                ? 'text-emerald-400'
                : beat.verdict === 'FAIL'
                  ? 'text-rose-400'
                  : 'text-slate-500'
            }
          >
            {beat.verdict || 'scanning'}
          </span>
          <span className="text-slate-500"> · MASVS-STORAGE-9</span>
        </span>
        <span className="mt-1 block min-h-[2.6em] font-mono text-[11px] leading-snug text-slate-400">
          {beat.caption}
        </span>
      </figcaption>
    </figure>
  );
}
