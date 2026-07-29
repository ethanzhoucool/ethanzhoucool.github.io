import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Instagram, Youtube, Mail } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1];

/*
 * Content.
 *
 * The old version led with `featured.png`, which was a screenshot of the
 * LOGGED-IN owner view of the YouTube channel: the "Customize channel" and
 * "Manage videos" buttons were both visible, along with the browser chrome and
 * a "...more" truncation. It also disagreed with the stat pills sitting
 * directly beneath it (screenshot: 13.8K subs / 219 videos, pills: 22K+ / 150+).
 *
 * Removed rather than cropped. The numbers now carry the section.
 */

const STATS = [
  { value: '10M+', label: 'views across platforms' },
  { value: '22K+', label: 'followers' },
  { value: '200+', label: 'videos published' },
];

const PLATFORMS = [
  {
    name: 'youtube',
    handle: '@Ethanzhouwealth',
    detail: '13.8K subscribers',
    href: 'https://www.youtube.com/@Ethanzhouwealth',
    Icon: Youtube,
  },
  {
    name: 'instagram',
    handle: '@ethanzhouwealth',
    detail: 'short-form explainers',
    href: 'https://instagram.com/ethanzhouwealth',
    Icon: Instagram,
  },
];

export default function Content() {
  const reduce = useReducedMotion();

  const enter = (i = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.6, delay: i * 0.07, ease: EASE },
        };

  return (
    <section className="mx-auto max-w-5xl px-6 pt-10 pb-24">
      <motion.h1
        {...enter(0)}
        className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl"
      >
        content
      </motion.h1>
      <motion.p
        {...enter(1)}
        className="mt-4 max-w-[52ch] text-base leading-relaxed text-slate-600 dark:text-slate-400"
      >
        i make short videos about investing and personal finance under
        @ethanzhouwealth. started august 2023, still going.
      </motion.p>

      {/* Numbers, in plain layout. No cards, no coloured pill soup. */}
      <motion.div
        {...enter(2)}
        className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800 sm:grid-cols-3"
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            className="bg-slate-50 px-6 py-8 dark:bg-slate-950 sm:px-7 sm:py-10"
          >
            <div className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              {s.value}
            </div>
            <div className="mt-2 text-sm text-slate-500 dark:text-slate-500">
              {s.label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Platforms. Different layout family from the stat strip above. */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 md:gap-5">
        {PLATFORMS.map((p, i) => (
          <motion.a
            key={p.name}
            {...enter(i)}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            className="group flex items-center gap-4 rounded-card border border-slate-200 bg-white/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700"
          >
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-slate-900/[0.05] text-slate-700 dark:bg-slate-100/[0.08] dark:text-slate-300">
              <p.Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-slate-900 dark:text-slate-50">
                {p.handle}
              </span>
              <span className="block truncate text-sm text-slate-500 dark:text-slate-500">
                {p.detail}
              </span>
            </span>
            <ArrowUpRight className="h-4 w-4 flex-none text-blue-600 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-blue-400" />
          </motion.a>
        ))}
      </div>

      {/* Brand work. */}
      <motion.div {...enter(0)} className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          brands i have worked with
        </h2>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <a
            href="https://turbo.ai"
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            aria-label="Turbo"
            className="block overflow-hidden rounded-card ring-1 ring-slate-200 transition-transform duration-300 hover:-translate-y-1 dark:ring-slate-800"
          >
            <img
              src="/images/turbo-logo.png"
              alt="Turbo"
              className="h-20 w-20 object-cover"
            />
          </a>
        </div>

        <p className="mt-8 text-sm text-slate-500 dark:text-slate-500">
          want to work together?{' '}
          <a
            href="mailto:info@ethanzhou.ca"
            data-hover
            className="inline-flex items-center gap-1 font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-slate-900 dark:text-slate-100 dark:decoration-slate-600 dark:hover:decoration-slate-100"
          >
            <Mail className="h-3.5 w-3.5" />
            info@ethanzhou.ca
          </a>
        </p>
      </motion.div>
    </section>
  );
}
