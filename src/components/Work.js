import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { FEATURED, PROJECTS, MORE_REPOS, GITHUB_URL } from '../data/work';
import Experience from './Experience';

const EASE = [0.16, 1, 0.3, 1];

/*
 * Work.
 *
 * The old projects tab had exactly one card on it while ~20 public repos sat
 * on GitHub unlinked.
 *
 * Deliberately typographic. There are no real screenshots for most of these
 * repos, and a grid of hand-built <div> mockups pretending to be product UI is
 * the single most obvious tell that a page was generated rather than designed.
 * Where a real asset exists (explain-my-code) it is used; everywhere else the
 * type does the work.
 */
export default function Work() {
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
        work
      </motion.h1>
      <motion.p
        {...enter(1)}
        className="mt-4 max-w-[52ch] text-base leading-relaxed text-slate-600 dark:text-slate-400"
      >
        mostly developer tooling for mobile teams. all of it is public, source
        included.
      </motion.p>

      {/* Feature row. Full-width, its own layout family. */}
      <motion.a
        {...enter(2)}
        href={FEATURED.repo}
        target="_blank"
        rel="noopener noreferrer"
        data-hover
        className="group mt-12 block overflow-hidden rounded-card border border-slate-200 bg-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700"
      >
        <div className="grid md:grid-cols-[1fr_0.9fr]">
          <div className="p-8 sm:p-10">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              {FEATURED.title}
            </h2>
            <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-slate-600 dark:text-slate-400">
              {FEATURED.blurb}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-2">
              {FEATURED.stack.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
            <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400">
              source on github
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>

          {/* Typographic panel rather than a fabricated product screenshot. */}
          <div
            aria-hidden="true"
            className="relative hidden items-center justify-center overflow-hidden border-l border-slate-200 bg-slate-900 md:flex dark:border-slate-800"
          >
            <div className="pointer-events-none select-none px-6 text-center font-mono text-[11px] leading-[1.9] tracking-tight text-slate-500">
              {FEATURED.note?.map((line) => (
                <React.Fragment key={line}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-transparent" />
          </div>
        </div>
      </motion.a>

      {/* Grid. Exactly as many cells as there are projects. */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 md:gap-5">
        {PROJECTS.map((p, i) => (
          <motion.a
            key={p.slug}
            {...enter(i)}
            href={p.live || p.repo}
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            className={`group flex flex-col overflow-hidden rounded-card border border-slate-200 bg-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700 ${
              p.media ? 'sm:col-span-2' : ''
            }`}
          >
            {p.media && (
              <div className="aspect-[21/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <video
                  src={p.media.src}
                  poster={p.media.poster}
                  preload="metadata"
                  className="h-full w-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </div>
            )}

            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                {p.title}
              </h3>
              <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {p.blurb}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {p.stack.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>

              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400">
                {p.live ? 'try it live' : 'source on github'}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Breadth without more cards. */}
      <motion.p
        {...enter(0)}
        className="mt-10 text-sm leading-relaxed text-slate-500 dark:text-slate-500"
      >
        also{' '}
        {MORE_REPOS.map((r, i) => (
          <React.Fragment key={r.name}>
            <a
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              data-hover
              className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-slate-700 dark:text-slate-300 dark:decoration-slate-600 dark:hover:decoration-slate-300"
            >
              {r.name}
            </a>
            {i < MORE_REPOS.length - 2 ? ', ' : i === MORE_REPOS.length - 2 ? ' and ' : ''}
          </React.Fragment>
        ))}
        , and the rest on{' '}
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-hover
          className="inline-flex items-center gap-1 font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-slate-700 dark:text-slate-300 dark:decoration-slate-600 dark:hover:decoration-slate-300"
        >
          <Github className="h-3.5 w-3.5" />
          github
        </a>
        .
      </motion.p>

      {/* Previously unreachable: rendered in App.js but no nav item pointed at it. */}
      <Experience />
    </section>
  );
}

function Chip({ children }) {
  return (
    <span className="rounded-chip bg-slate-900/[0.05] px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-100/[0.08] dark:text-slate-400">
      {children}
    </span>
  );
}
