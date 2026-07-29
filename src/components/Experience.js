import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];

/*
 * Experience.
 *
 * This content already existed in the codebase under `activeTab === 'experience'`
 * but the nav only ever rendered ['about', 'projects', 'social media'], so there
 * was no way to reach it. It rendered for nobody.
 *
 * Now it lives at the bottom of the work page. Rows rather than cards, and one
 * hairline between entries instead of a border on every row.
 */

const ROLES = [
  {
    role: 'Marketing & Business Strategy Intern',
    org: 'United Lifts Technologies',
    period: 'April 2025 to present',
    place: 'Calgary',
    points: [
      'rebuilt 10+ website pages for UX and SEO',
      'search rankings up 38%',
      'linkedin engagement up 256%',
    ],
  },
  {
    role: 'Content Creator',
    org: '@ethanzhouwealth',
    period: 'August 2023 to present',
    place: 'youtube, tiktok, instagram',
    points: [
      '200+ educational finance videos',
      '10M+ views across platforms',
      'audience of 22,000+',
    ],
  },
];

export default function Experience() {
  const reduce = useReducedMotion();

  return (
    <div className="mt-20 border-t border-slate-200 pt-14 dark:border-slate-800">
      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50"
      >
        experience
      </motion.h2>

      <div className="mt-8 divide-y divide-slate-200 dark:divide-slate-800">
        {ROLES.map((r, i) => (
          <motion.div
            key={r.org}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            className="grid gap-3 py-7 sm:grid-cols-[0.8fr_1.2fr] sm:gap-8"
          >
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {r.org}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                {r.period}
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-600">
                {r.place}
              </div>
            </div>

            <div>
              <div className="text-base text-slate-800 dark:text-slate-200">
                {r.role}
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}
