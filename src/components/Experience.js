import React from 'react';
import { ROLES, EDUCATION } from '../data/experience';


/*
 * Experience.
 *
 * This content already existed in the codebase under `activeTab === 'experience'`
 * but the nav only ever rendered ['about', 'projects', 'social media'], so there
 * was no way to reach it. It rendered for nobody.
 *
 * Rows rather than cards, and one hairline between entries instead of a border
 * on every row. Data lives in src/data/experience.js.
 */
export default function Experience() {

  return (
    <div className="mt-20 border-t border-slate-200 pt-14 dark:border-slate-800">
      <h2
        className="rise rise-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
      >
        experience
      </h2>

      <div className="mt-8 divide-y divide-slate-200 dark:divide-slate-800">
        {ROLES.map((r, i) => (
          <div
            key={`${r.org}-${r.role}`}
            className="grid gap-3 py-7 sm:grid-cols-[0.8fr_1.2fr] sm:gap-8"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  {r.org}
                </span>
                {r.note && (
                  <span className="rounded-chip bg-slate-900/[0.05] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500 dark:bg-slate-100/[0.08] dark:text-slate-400">
                    {r.note}
                  </span>
                )}
                {r.current && (
                  <span className="rounded-chip bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    now
                  </span>
                )}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                {r.period}
              </div>
              {r.place && (
                <div className="text-xs text-slate-400 dark:text-slate-600">
                  {r.place}
                </div>
              )}
            </div>

            <div>
              <div className="text-base text-slate-800 dark:text-slate-200">
                {r.role}
                {r.kind && (
                  <span className="text-slate-400 dark:text-slate-500"> · {r.kind}</span>
                )}
              </div>
              <ul className="mt-3 space-y-1.5">
                {r.points.map((p) => (
                  <li
                    key={p}
                    className="text-sm leading-relaxed text-slate-600 dark:text-slate-400"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <div
          className="grid gap-3 py-7 sm:grid-cols-[0.8fr_1.2fr] sm:gap-8"
        >
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {EDUCATION.school}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              {EDUCATION.period}
            </div>
          </div>
          <div className="text-base text-slate-800 dark:text-slate-200">
            {EDUCATION.degree}
            <span className="text-slate-400 dark:text-slate-500"> · {EDUCATION.note}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
