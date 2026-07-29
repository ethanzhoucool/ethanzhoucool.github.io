import { useRef } from 'react';
import { motion, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { useNarrativeProgress } from './primitives';

/* ─── Judo quote — sticky character reveal with brush underline ─── */
const JudoChar = ({ char, progress, start, end }) => {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
};

/* ─── Hero quote — asymmetric left-aligned layout ─── */

/* ─── Judo quote — sticky scroll-locked character reveal with brush underline ─── */
const JudoQuote = () => {
  const ref = useRef(null);
  const scrollYProgress = useNarrativeProgress({
    target: ref,
    offset: ['start start', 'end start'],
  }, 0.6);

  /* A sticky child of height 1vh unpins at progress (H - 1) / H, where H is the
     parent height in viewport units. At H = 2.2 that is 0.545, so every beat
     below has to land before ~0.52 or it plays after the text has already
     scrolled off screen. The original 350vh section happened to satisfy this;
     shortening it without remapping the ranges did not. */
  const introOpacity = useTransform(scrollYProgress, [0.03, 0.12], [0, 1]);
  const introY = useTransform(scrollYProgress, [0.03, 0.12], [15, 0]);

  const quote = '"maximum efficient use of energy"';
  const chars = quote.split('');

  /* Brush underline draws in once the last character has landed. */
  const underlineScale = useTransform(scrollYProgress, [0.46, 0.53], [0, 1]);
  const smoothUnderline = useSpring(underlineScale, { stiffness: 120, damping: 30 });

  /* The footage rises with the quote and leaves before the section unpins. */
  const reduce = useReducedMotion();
  const videoOpacity = useTransform(scrollYProgress, [0.04, 0.16, 0.46, 0.55], [0, 1, 1, 0]);
  const videoScale = useTransform(scrollYProgress, [0.04, 0.55], [1.12, 1]);

  return (
    /* Was 350vh, the largest scroll budget on the whole page, spent on a
       linear typewriter of 33 characters. */
    <div ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen items-center px-6">
        {/* Real footage, finally. The narrative ran ~20 screens on three small
            SVGs and no imagery at all, while this clip of Ethan actually
            training sat unused in a card grid at the very end. The quote is
            about judo, so the footage belongs here.

            Framed portrait rather than full-bleed: the source is 1080x1920, so
            object-cover across a landscape viewport crops away both figures and
            leaves a band of torsos and the car park behind them.

            This is also the only section on the page that is not centred, which
            after nineteen centred screens is its own kind of relief. */}
        {/* Text takes the larger share: at [1.15fr_0.85fr] the quote column was
            ~460px and "energy" broke across lines mid-word. */}
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-[0.82fr_1.18fr] md:gap-12">
          <motion.figure
            style={{ opacity: reduce ? 1 : videoOpacity, scale: reduce ? 1 : videoScale }}
            className="m-0 w-full"
          >
            <div className="overflow-hidden rounded-2xl bg-slate-200 shadow-card ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-slate-100/10">
              <img
                src="/images/judo-throw.jpg"
                alt="Ethan mid-throw in a judo gi, loading his opponent onto his hip, in the Western Mustangs wrestling room."
                width="1800"
                height="1200"
                decoding="async"
                className="aspect-[3/2] w-full object-cover"
              />
            </div>
          </motion.figure>

          <div className="space-y-4 text-left sm:space-y-6">
            <motion.p
              style={{ opacity: introOpacity, y: introY }}
              className="text-slate-500 dark:text-slate-400 text-sm sm:text-base md:text-lg"
            >
              It's similar to a concept we use in Judo:
            </motion.p>
            <p className="font-playfair italic text-2xl sm:text-3xl md:text-4xl text-slate-700 dark:text-slate-200 leading-snug relative inline-block">
            {chars.map((char, i) => {
              /* Eased rather than linear. Each character used to cost the same
                 amount of scroll, which for a line about the efficient use of
                 energy is the wrong feeling. Raising the position to a power
                 spaces the opening characters roughly 4x further apart than
                 the closing ones, so the quote takes effort to start and then
                 finishes itself. */
              const eased = Math.pow(i / chars.length, 0.7);
              const start = 0.13 + eased * 0.28;
              const end = start + 0.28 / chars.length + 0.05;
              return (
                <JudoChar key={i} char={char} progress={scrollYProgress} start={start} end={end} />
              );
            })}
              {/* Brush-stroke underline */}
              <motion.span
                style={{ scaleX: smoothUnderline, transformOrigin: 'left' }}
                className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 opacity-60"
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export { JudoQuote };
