import React from 'react';

/* redaction-checker's terminal output — what the tool prints when it runs
   across a whole app, next to the phone showing it happen. */
const LINES = [
  ['$', 'redaction-checker scan --ios', ''],
  ['', '', ''],
  ['ok', 'Login', 'no sensitive fields'],
  ['ok', 'Home', 'no sensitive fields'],
  ['fail', 'Accounts', 'balance legible'],
  ['fail', 'Card detail', 'PAN legible'],
  ['ok', 'Settings', 'no sensitive fields'],
  ['', '', ''],
  ['sum', '2 of 5 screens leak · MASVS-STORAGE-9', ''],
];

export default function ScanReport({ className = '' }) {
  return (
    <figure
      className={`m-0 overflow-hidden rounded-card bg-slate-950 px-4 py-3.5 ring-1 ring-slate-900/10 dark:ring-slate-100/10 ${className}`}
    >
      <pre className="whitespace-pre-wrap font-mono text-[11px] leading-[1.75] text-slate-200">
        {LINES.map(([kind, a, b], i) => (
          <div key={i}>
            {kind === '$' && (
              <>
                <span className="text-emerald-400">$ </span>
                <span>{a}</span>
              </>
            )}
            {kind === 'ok' && (
              <>
                <span className="text-emerald-400">  PASS  </span>
                <span className="inline-block w-[88px]">{a}</span>
                <span className="text-slate-500">{b}</span>
              </>
            )}
            {kind === 'fail' && (
              <>
                <span className="text-rose-400">  FAIL  </span>
                <span className="inline-block w-[88px]">{a}</span>
                <span className="text-rose-400">{b}</span>
              </>
            )}
            {kind === 'sum' && <span className="text-slate-500">{a}</span>}
            {kind === '' && <>&nbsp;</>}
          </div>
        ))}
      </pre>
    </figure>
  );
}
