import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Mail, Check, Github } from 'lucide-react';
import { FlipPhoto, MagneticButton, ProximityText } from './ui';
import { GITHUB_URL } from '../data/work';

const EASE = [0.16, 1, 0.3, 1];
const EMAIL = 'info@ethanzhou.ca';

/*
 * The primary CTA was a bare mailto. That silently does nothing for anyone
 * without a default mail client registered, which is most people reading
 * webmail in a browser tab: the button looked broken.
 *
 * It is still a real anchor, so a configured client opens as before and
 * right-click copy-link-address still works. On top of that the click copies
 * the address and says so, so the button always does something visible.
 */
function EmailButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = useCallback(() => {
    // No preventDefault: the mailto still fires for anyone who can use it.
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(EMAIL).then(
        () => {
          setCopied(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setCopied(false), 2200);
        },
        () => {}
      );
    }
  }, []);

  return (
    <a
      href={`mailto:${EMAIL}`}
      onClick={onClick}
      data-hover
      aria-label={`Email ${EMAIL}`}
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow-card transition-all duration-300 hover:shadow-card-hover active:translate-y-px dark:bg-slate-50 dark:text-slate-900"
    >
      {copied ? <Check className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
      {copied ? 'copied to clipboard' : EMAIL}
    </a>
  );
}

/*
 * Hero.
 *
 * Replaces the old centred stack (Caveat handwriting headline, "eng student
 * who makes things on the internet", three pill buttons in a row). That version
 * said nothing specific and looked like every other student portfolio.
 *
 * Layout is an asymmetric split at DESIGN_VARIANCE 7: copy left, portrait
 * right, collapsing to a single column under md.
 *
 * Hero stack discipline: 3 text elements (headline, subtext, CTAs). No eyebrow,
 * no trust strip, no scroll cue.
 */
export default function Home({ navigate }) {
  const reduce = useReducedMotion();
  const rise = (delay) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  return (
    <>
      <section className="mx-auto flex min-h-[calc(100dvh-68px)] max-w-5xl flex-col justify-center px-6 pt-8 pb-16 md:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-[1.35fr_0.65fr] md:gap-16">
          <div>
            <motion.h1
              {...rise(0.05)}
              /* Sized so "and things people watch." holds one line inside the
                 616px text column. At 4.2rem it wrapped to three lines. */
              className="text-[2.15rem] font-semibold leading-[1.08] tracking-tight text-slate-900 dark:text-slate-50 sm:text-[2.9rem] md:text-[3.3rem]"
            >
              <ProximityText text="i build software," />
              <br />
              <span className="text-slate-400 dark:text-slate-500">
                <ProximityText text="and things people watch." />
              </span>
            </motion.h1>

            <motion.p
              {...rise(0.15)}
              className="mt-6 max-w-[46ch] text-base leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg"
            >
              engineering student. mobile developer tools during the week,
              finance videos for 22,000 people the rest of the time.
            </motion.p>

            <motion.div {...rise(0.25)} className="mt-9 flex flex-wrap items-center gap-3">
              <MagneticButton>
                <EmailButton />
              </MagneticButton>

              <MagneticButton>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-hover
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition-all duration-300 hover:border-slate-400 hover:bg-white active:translate-y-px dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-900"
                >
                  <Github className="h-4 w-4" />
                  github
                </a>
              </MagneticButton>
            </motion.div>
          </div>

          <motion.div
            {...rise(0.2)}
            className="order-first flex justify-center md:order-none md:justify-end"
          >
            <FlipPhoto className="h-40 w-40 sm:h-52 sm:w-52 md:h-60 md:w-60" />
          </motion.div>
        </div>
      </section>

      <TwoTracks navigate={navigate} />
    </>
  );
}

/*
 * The two tracks, weighted equally.
 *
 * A 50/50 grid rather than a hierarchy, because the brief was that the
 * building and the audience carry the same weight.
 */
function TwoTracks({ navigate }) {
  const reduce = useReducedMotion();

  const tracks = [
    {
      key: 'work',
      kicker: 'the building',
      title: 'developer tools for mobile teams',
      body:
        'ci bots, security scanners and sdks that catch the things manual testing misses: leaked screens, dead flows, silent drop-off.',
      stat: '20+',
      statLabel: 'public repos',
      cta: 'see the work',
      route: 'work',
    },
    {
      key: 'content',
      kicker: 'the audience',
      title: 'short finance videos, made since 2023',
      body:
        'explainers about investing and personal finance, published under @ethanzhouwealth. mostly under a minute.',
      stat: '10M+',
      statLabel: 'views',
      cta: 'see the content',
      route: 'content',
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {tracks.map((t, i) => (
          <motion.button
            key={t.key}
            onClick={() => navigate(t.route)}
            data-hover
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            className="group relative flex flex-col rounded-card border border-slate-200 bg-white/70 p-7 text-left transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700 sm:p-8"
          >
            <span className="text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              {t.kicker}
            </span>

            <h2 className="mt-4 text-xl font-semibold leading-snug tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
              {t.title}
            </h2>

            <p className="mt-3 max-w-[42ch] flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t.body}
            </p>

            <div className="mt-7 flex items-end justify-between gap-4 border-t border-slate-200/80 pt-5 dark:border-slate-800">
              <div>
                <div className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  {t.stat}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500">
                  {t.statLabel}
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400">
                {t.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.p
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-10 text-sm text-slate-500 dark:text-slate-500"
      >
        why i pick the projects i pick:{' '}
        <button
          onClick={() => navigate('about')}
          data-hover
          className="inline-flex items-center gap-1 font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 transition-colors hover:decoration-slate-900 dark:text-slate-100 dark:decoration-slate-600 dark:hover:decoration-slate-100"
        >
          asymmetric risk
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </motion.p>
    </section>
  );
}
