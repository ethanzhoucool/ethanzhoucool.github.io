import React from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { FEATURED, FEATURED_TWO, PROJECTS, MORE_REPOS, GITHUB_URL } from '../data/work';
import Experience from './Experience';

import PhoneScan from './artifacts/PhoneScan';
import ScanReport from './artifacts/ScanReport';
import DropoffFigure from './artifacts/DropoffFigure';
import BotComment from './artifacts/BotComment';
import DeviceGif from './artifacts/DeviceGif';
import RobotPath from './artifacts/RobotPath';

/* Read once. Autoplaying video is motion, and a reduced-motion visitor should
   get a poster frame and a play button instead. */
const PREFERS_REDUCED_MOTION =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/*
 * Work.
 *
 * The old projects tab had exactly one card on it while ~20 public repos sat
 * on GitHub unlinked.
 *
 * Each project renders its own output rather than a screenshot of a product
 * that does not exist: the comment the CI bot leaves on a PR, the report the
 * scanner prints, the frame the recorder hands back, the path the robot
 * actually drove. These are the artifacts, drawn in the DOM, so they stay
 * sharp and their text is real text.
 */

function Artifact({ name }) {
  if (name === 'comment') return <BotComment />;
  if (name === 'gif') return <DeviceGif />;
  if (name === 'robot') return <RobotPath />;
  return null;
}
export default function Work() {

  return (
    <section className="mx-auto max-w-5xl px-6 pt-10 pb-24">
      <h1
        className="rise rise-1 text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl"
      >
        work
      </h1>
      <p
        className="rise rise-2 mt-4 max-w-[52ch] text-base leading-relaxed text-slate-600 dark:text-slate-400"
      >
        mostly developer tooling for mobile teams. all of it is public, source
        included.
      </p>

      {/* Feature row. Full-width, its own layout family. */}
      <a
        href={FEATURED.repo}
        target="_blank"
        rel="noopener noreferrer"
        data-hover
        className="rise rise-3 group mt-12 block overflow-hidden rounded-card border border-slate-200 bg-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700"
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

          {/* The report the tool actually renders, not a caption about it. */}
          <div data-artifact className="relative flex flex-col items-center justify-center gap-5 overflow-hidden border-t border-slate-200 bg-slate-900 p-8 md:border-l md:border-t-0 dark:border-slate-800">
            <DropoffFigure />
            <div className="select-none text-center font-mono text-[10px] leading-[1.9] text-slate-500">
              {FEATURED.note?.map((line) => (
                <React.Fragment key={line}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </a>

      {/* Second feature, mirrored. The phone demo needs the height, and
          alternating the dark panel keeps the two rows from rhyming. */}
      <a
        href={FEATURED_TWO.repo}
        target="_blank"
        rel="noopener noreferrer"
        data-hover
        className="rise rise-4 group mt-5 block overflow-hidden rounded-card border border-slate-200 bg-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700"
      >
        <div className="grid md:grid-cols-[0.9fr_1fr]">
          <div data-artifact className="order-last flex flex-col items-center justify-center gap-7 overflow-hidden border-t border-slate-200 bg-slate-900 p-8 md:order-first md:border-r md:border-t-0 dark:border-slate-800">
            <PhoneScan />
          </div>

          <div className="p-8 sm:p-10">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              {FEATURED_TWO.title}
            </h2>
            <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-slate-600 dark:text-slate-400">
              {FEATURED_TWO.blurb}
            </p>

            <div data-artifact className="mt-6">
              <ScanReport />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {FEATURED_TWO.stack.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
            <span className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400">
              source on github
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </a>

      {/* Grid. Exactly as many cells as there are projects. */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 md:gap-5">
        {PROJECTS.map((p, i) => (
          <a
            key={p.slug}
            href={p.live || p.repo}
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            className="group flex flex-col overflow-hidden rounded-card border border-slate-200 bg-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700"
          >
            {p.media && (
              <div data-artifact className="flex h-[224px] items-center justify-center overflow-hidden border-b border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
                <video
                  src={p.media.src}
                  poster={p.media.poster}
                  preload="metadata"
                  className="h-full w-full object-cover"
                  autoPlay={!PREFERS_REDUCED_MOTION}
                  loop
                  muted
                  playsInline
                />
              </div>
            )}

            {p.art && (
              <div data-artifact className="flex h-[224px] items-center justify-center overflow-hidden border-b border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/40">
                <Artifact name={p.art} />
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
          </a>
        ))}
      </div>

      {/* Breadth without more cards. */}
      <p
        className="rise rise-1 mt-10 text-sm leading-relaxed text-slate-500 dark:text-slate-500"
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
      </p>

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
