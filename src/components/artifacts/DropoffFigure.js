import React from 'react';

/*
 * atlas-dropoff's report: the funnel number painted onto the screen the user
 * actually quit on. A bar chart tells you 38% left at step 3; this tells you
 * which step 3, and what it looked like.
 *
 * Sits on the dark feature panel, so it is styled for that ground only.
 */
const STEPS = [
  { label: 'cart', pct: 100 },
  { label: 'address', pct: 81 },
  { label: 'payment', pct: 43 },
  { label: 'confirm', pct: 39 },
];

export default function DropoffFigure() {
  return (
    <figure className="m-0 flex w-full max-w-[330px] items-stretch gap-4">
      {/* The screen they quit on */}
      <div className="relative w-[118px] flex-none overflow-hidden rounded border border-slate-700 bg-slate-800">
        <div className="px-2.5 pb-2 pt-3">
          <div className="font-mono text-[7px] uppercase tracking-[0.18em] text-slate-500">
            payment
          </div>
          <div className="mt-2 h-5 rounded-sm bg-slate-700/70" />
          <div className="mt-1.5 h-5 rounded-sm bg-slate-700/70" />
          <div className="mt-1.5 flex gap-1.5">
            <div className="h-5 flex-1 rounded-sm bg-slate-700/70" />
            <div className="h-5 w-7 rounded-sm bg-slate-700/70" />
          </div>
          <div className="mt-3 h-6 rounded-sm bg-blue-500/70" />
        </div>

        {/* The drop-off, stamped on top */}
        <div className="absolute inset-x-0 top-[47%] border-y border-dashed border-rose-400 bg-rose-500/20 py-1">
          <span className="block px-2 font-mono text-[9px] font-medium text-rose-300">
            −38% quit here
          </span>
        </div>
      </div>

      {/* The funnel it came from */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5">
        {STEPS.map((s, i) => {
          const worst = i > 0 && STEPS[i - 1].pct - s.pct === 38;
          return (
            <div key={s.label}>
              <div className="flex items-baseline justify-between font-mono text-[10px]">
                <span className={worst ? 'text-rose-300' : 'text-slate-400'}>{s.label}</span>
                <span className={worst ? 'text-rose-300' : 'text-slate-500'}>{s.pct}%</span>
              </div>
              <div className="mt-1 h-[6px] w-full rounded-sm bg-slate-800">
                <div
                  className={`h-full rounded-sm ${worst ? 'bg-rose-400' : 'bg-slate-600'}`}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
