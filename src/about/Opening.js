import { useRef, useMemo } from 'react';
import { motion, useTransform, useSpring } from 'framer-motion';
import { useNarrativeProgress } from './primitives';

/* ─── Hero quote — asymmetric left-aligned layout ─── */
const HeroQuote = () => {
  const heroRef = useRef(null);
  const scrollYProgress = useNarrativeProgress({ target: heroRef, offset: ['start start', 'end start'] }, 0.0);

  /* Fade/scale out as user scrolls away */
  const fadeOut = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scaleOut = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);
  const yOut = useTransform(scrollYProgress, [0, 0.6], [0, -40]);

  /* Scroll-driven entrance: each element appears based on scroll position within the section */
  const contentRef = useRef(null);
  const enterProgress = useNarrativeProgress({
    target: contentRef,
    offset: ['start end', 'start 0.3'],
  }, 1.0);

  const tagOpacity = useTransform(enterProgress, [0, 0.15], [0, 1]);
  const tagY = useTransform(enterProgress, [0, 0.15], [15, 0]);

  const titleOpacity = useTransform(enterProgress, [0.1, 0.3], [0, 1]);
  const titleY = useTransform(enterProgress, [0.1, 0.3], [30, 0]);

  const dividerScale = useTransform(enterProgress, [0.25, 0.5], [0, 1]);

  const quoteOpacity = useTransform(enterProgress, [0.4, 0.65], [0, 1]);
  const quoteY = useTransform(enterProgress, [0.4, 0.65], [20, 0]);

  const scrollIndicatorOpacity = useTransform(enterProgress, [0.6, 0.85], [0, 1]);

  /* Premium blur-to-sharp reveals */
  const tagBlur = useTransform(enterProgress, [0, 0.15], [4, 0]);
  const tagFilter = useTransform(tagBlur, (v) => `blur(${v}px)`);
  const titleBlur = useTransform(enterProgress, [0.1, 0.3], [12, 0]);
  const titleFilter = useTransform(titleBlur, (v) => `blur(${v}px)`);
  const titleScale = useTransform(enterProgress, [0.1, 0.35], [0.97, 1]);
  const quoteBlur = useTransform(enterProgress, [0.4, 0.65], [8, 0]);
  const quoteFilter = useTransform(quoteBlur, (v) => `blur(${v}px)`);

  /* "Asymmetric" split — halves collide from opposite sides */
  const asymX = useTransform(enterProgress, [0.1, 0.3], [-120, 0]);
  const asymScale = useTransform(enterProgress, [0.1, 0.3], [1.15, 1]);
  const asymSpringX = useSpring(asymX, { stiffness: 200, damping: 20 });
  const asymSpringScale = useSpring(asymScale, { stiffness: 200, damping: 20 });
  const metricX = useTransform(enterProgress, [0.1, 0.3], [80, 0]);
  const metricScale = useTransform(enterProgress, [0.1, 0.3], [0.85, 1]);
  const metricSpringX = useSpring(metricX, { stiffness: 200, damping: 20 });
  const metricSpringScale = useSpring(metricScale, { stiffness: 200, damping: 20 });

  return (
    <div ref={heroRef} className="min-h-[85vh] relative">
      <motion.div
        ref={contentRef}
        style={{ opacity: fadeOut, scale: scaleOut, y: yOut }}
        className="relative z-10 min-h-[85vh] flex flex-col justify-start pt-[4vh] sm:pt-[6vh] pb-8 px-8 sm:px-12 md:px-20 lg:px-28 max-w-6xl mx-auto"
      >
        {/* MY PHILOSOPHY — tiny uppercase tag */}
        <motion.p
          style={{ opacity: tagOpacity, y: tagY, filter: tagFilter }}
          className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-slate-400 dark:text-slate-500 mb-6 sm:mb-8 md:mb-10 font-medium"
        >
          my philosophy
        </motion.p>

        {/* ASYMMETRIC RISK — massive bold heading */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY, filter: titleFilter, scale: titleScale }}
          className="mb-5 sm:mb-7 relative"
        >
          <motion.div
            style={{ opacity: titleOpacity }}
            className="absolute -inset-16 sm:-inset-24 bg-blue-500/[0.07] dark:bg-blue-400/[0.1] rounded-[80px] blur-[100px] pointer-events-none"
          />
          <h1 className="relative font-bold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-[0.9] text-slate-800 dark:text-slate-100">
            <span className="text-blue-600 dark:text-blue-400 inline-flex">
              <motion.span style={{ x: asymSpringX, scale: asymSpringScale }} className="inline-block origin-right">Asym</motion.span>
              <motion.span style={{ x: metricSpringX, scale: metricSpringScale }} className="inline-block origin-left">metric</motion.span>
            </span>
            <br />
            risk
          </h1>
        </motion.div>

        {/* Off-center asymmetric divider */}
        <motion.div
          style={{ scaleX: dividerScale }}
          className="origin-left mb-6 sm:mb-8"
        >
          <div className="h-[2px] w-32 sm:w-48 md:w-64 bg-blue-500/40 dark:bg-blue-400/40" />
        </motion.div>

        {/* Definition — smaller serif, generous line height */}
        <motion.blockquote
          style={{ opacity: quoteOpacity, y: quoteY, filter: quoteFilter }}
          className="max-w-lg"
        >
          <p className="font-playfair text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed sm:leading-[1.8] font-normal">
            Taking a risk where the potential return far exceeds the risk taken.
          </p>
        </motion.blockquote>

        {/* Spacer to push scroll indicator down */}
        <div className="flex-1" />

        {/* Scroll indicator — flows at the bottom */}
        <motion.div style={{ opacity: scrollIndicatorOpacity }}>
          <div className="flex items-center gap-3">
            <div className="w-px h-8 sm:h-10 bg-slate-300 dark:bg-slate-600 animate-pulse" />
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-slate-400 dark:text-slate-600 font-medium">scroll</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
/* ─── "Leverage" section — interactive SVG lever mechanism ─── */

/* ─── Obsession statement — gravitational vortex ─── */
const VortexWord = ({ word, progress, index, startX, startY, startRotate }) => {
  const isObsessed = word === 'obsessed';

  /* Timing: "obsessed" appears first (gravitational center), others orbit in after */
  const adjustedIdx = index > 1 ? index - 1 : index;
  const start = isObsessed ? 0.06 : 0.14 + adjustedIdx * 0.06;
  const end = isObsessed ? 0.25 : start + 0.22;

  /* Orbital position → reading position */
  const x = useTransform(progress, [start, end], [startX, 0]);
  const y = useTransform(progress, [start, end], [startY, 0]);
  const rotate = useTransform(progress, [start, end], [startRotate, 0]);
  const opacity = useTransform(progress, [start, start + 0.1], [0, 1]);
  const convergenceScale = useTransform(progress, [start, end], [0.8, 1]);

  /* "obsessed": convergence then heartbeat pulse */
  const obsessedScale = useTransform(progress,
    [0.06, 0.25, 0.5, 0.55, 0.6, 0.65, 0.7],
    [0.8, 1, 1, 1.08, 1, 1.05, 1]
  );

  /* Shimmer on "obsessed" */
  const shimmerPos = useTransform(progress, [0.65, 0.88], [-200, 200]);
  const backgroundPosition = useTransform(shimmerPos, (v) => `${v}% center`);

  return (
    <motion.span
      style={{
        x, y, rotate, opacity,
        scale: isObsessed ? obsessedScale : convergenceScale,
        ...(isObsessed && { backgroundPosition }),
      }}
      className={isObsessed ? 'obsession-shimmer font-semibold' : ''}
    >
      {word}
    </motion.span>
  );
};

const ObsessionStatement = () => {
  const ref = useRef(null);
  const scrollYProgress = useNarrativeProgress({
    target: ref,
    offset: ['start start', 'end start'],
  }, 0.6);

  const words = useMemo(() => [
    { text: "I'm", startX: -140, startY: -70, startRotate: -20 },
    { text: 'obsessed', startX: 0, startY: 0, startRotate: 0 },
    { text: 'with', startX: 130, startY: -55, startRotate: 12 },
    { text: 'this', startX: -100, startY: 65, startRotate: -8 },
    { text: 'idea.', startX: 150, startY: 50, startRotate: 15 },
  ], []);

  /* Concentric rings — contract inward as words converge */
  const ring1Scale = useTransform(scrollYProgress, [0.1, 0.65], [2.5, 0.3]);
  const ring2Scale = useTransform(scrollYProgress, [0.15, 0.7], [2, 0.25]);
  const ring3Scale = useTransform(scrollYProgress, [0.2, 0.75], [1.6, 0.2]);
  const ringOpacity = useTransform(scrollYProgress, [0.08, 0.25, 0.65, 0.8], [0, 0.18, 0.18, 0]);

  return (
    <div ref={ref} className="relative h-[250vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center px-6">
        <div className="relative max-w-2xl">
          {/* Concentric rings — vortex visual */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="300" height="300" viewBox="-150 -150 300 300" className="overflow-visible">
              <motion.circle cx="0" cy="0" r="80" fill="none" strokeWidth="1"
                className="stroke-blue-400 dark:stroke-blue-300"
                style={{ scale: ring1Scale, opacity: ringOpacity }}
              />
              <motion.circle cx="0" cy="0" r="60" fill="none" strokeWidth="1"
                className="stroke-blue-400 dark:stroke-blue-300"
                style={{ scale: ring2Scale, opacity: ringOpacity }}
              />
              <motion.circle cx="0" cy="0" r="40" fill="none" strokeWidth="1"
                className="stroke-blue-400 dark:stroke-blue-300"
                style={{ scale: ring3Scale, opacity: ringOpacity }}
              />
            </svg>
          </div>

          {/* Words — orbit inward toward "obsessed" */}
          <p className="relative z-10 text-2xl sm:text-3xl md:text-4xl text-slate-800 dark:text-slate-100 text-center font-medium leading-snug flex flex-wrap justify-center gap-x-[0.3em]">
            {words.map((w, i) => (
              <VortexWord key={i} word={w.text} progress={scrollYProgress} index={i}
                startX={w.startX} startY={w.startY} startRotate={w.startRotate} />
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─── Judo quote — sticky scroll-locked character reveal with brush underline ─── */

export { HeroQuote, ObsessionStatement };
