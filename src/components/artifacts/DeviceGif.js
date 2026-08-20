import React from 'react';

/* device-gif-maker's output is a device frame, so the artifact is one: the
   pristine frame it renders, holding the flow it just recorded. */
export default function DeviceGif() {
  return (
    <figure className="m-0 flex items-center justify-center gap-5">
      <div className="w-[92px]">
        <div className="rounded-[15px] bg-slate-950 p-[4px] shadow-card">
          <div className="relative aspect-[9/17] overflow-hidden rounded-[11px] bg-white">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="h-6 w-6 rounded-full border border-slate-300" />
              <div className="h-1.5 w-11 rounded-full bg-slate-200" />
              <div className="h-1.5 w-7 rounded-full bg-slate-200" />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-slate-200 bg-slate-50 px-2 py-1">
              <span className="font-mono text-[8px] text-slate-400">frame</span>
              <span className="font-mono text-[8px] text-slate-400">041/118</span>
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
