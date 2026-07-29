import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue, useMotionTemplate, useReducedMotion, AnimatePresence } from 'framer-motion';
import { Mail, Instagram, Linkedin, Youtube } from 'lucide-react';

import { useHashRoute } from './useHashRoute';
import { CustomCursor } from './components/ui';
import Nav from './components/Nav';
import Home from './components/Home';
import Work from './components/Work';
import Content from './components/Content';

/* ─── Scroll-reveal section wrapper — scroll-progress driven ─── */
const ScrollSection = ({ children, className = '', height = 'min-h-[70vh]', id }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.35'],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <div ref={ref} id={id} className={`${height} flex items-center justify-center px-6 ${className}`}>
      <motion.div style={{ opacity, y }} className="w-full max-w-2xl mx-auto">
        {children}
      </motion.div>
    </div>
  );
};

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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

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
const JudoQuote = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

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
const HeroQuote = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });

  /* Fade/scale out as user scrolls away */
  const fadeOut = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scaleOut = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);
  const yOut = useTransform(scrollYProgress, [0, 0.6], [0, -40]);

  /* Scroll-driven entrance: each element appears based on scroll position within the section */
  const contentRef = useRef(null);
  const { scrollYProgress: enterProgress } = useScroll({
    target: contentRef,
    offset: ['start end', 'start 0.3'],
  });

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
const LeverageSection = () => {
  const ref = useRef(null);
  const svgRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const isInView = useInView(ref, { amount: 0.15 });

  /* Section entrance */
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);
  const sectionY = useTransform(scrollYProgress, [0, 0.12], [40, 0]);

  /* "leverage." text — blur-to-sharp */
  const wordOpacity = useTransform(scrollYProgress, [0.08, 0.22], [0, 1]);
  const wordBlur = useTransform(scrollYProgress, [0.08, 0.22], [12, 0]);
  const wordFilter = useTransform(wordBlur, (v) => `blur(${v}px)`);

  /* Beam rotation — scroll-driven primary + mouse-driven secondary */
  const scrollTilt = useTransform(scrollYProgress, [0.2, 0.65], [0, -14]);
  const mouseTilt = useMotionValue(0);
  const smoothMouseTilt = useSpring(mouseTilt, { stiffness: 150, damping: 25 });
  const beamAngle = useTransform([scrollTilt, smoothMouseTilt], ([s, m]) => s + m);
  const smoothBeam = useSpring(beamAngle, { stiffness: 120, damping: 20 });

  /* Result glow intensifies as beam tips */
  const resultGlow = useTransform(scrollYProgress, [0.45, 0.65], [0, 0.5]);

  /* Labels + SVG entrance */
  const labelOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const svgOpacity = useTransform(scrollYProgress, [0.14, 0.28], [0, 1]);
  const svgY = useTransform(scrollYProgress, [0.14, 0.28], [20, 0]);

  /* Mouse handlers — tilt beam on hover */
  const handleMouseMove = useCallback((event) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const x = Math.max(-1, Math.min(1, (event.clientX - centerX) / (rect.width / 2)));
    mouseTilt.set(x * -6);
  }, [mouseTilt]);

  const resetTilt = useCallback(() => {
    mouseTilt.set(0);
  }, [mouseTilt]);

  useEffect(() => {
    if (!isInView) {
      resetTilt();
      return undefined;
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', resetTilt);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', resetTilt);
    };
  }, [handleMouseMove, isInView, resetTilt]);

  return (
    <div ref={ref} className="relative h-[140vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center px-6">
        <motion.div
          style={{ opacity: sectionOpacity, y: sectionY }}
          className="text-center max-w-2xl mx-auto"
        >
          <p className="text-xl sm:text-2xl md:text-3xl text-slate-600 dark:text-slate-300 leading-relaxed">
            The ultimate concept between these two ideas is
          </p>
          <motion.p
            style={{ opacity: wordOpacity, filter: wordFilter }}
            className="mt-3 sm:mt-4 text-5xl sm:text-6xl md:text-8xl font-playfair font-bold text-slate-800 dark:text-slate-100"
          >
            leverage.
          </motion.p>

          {/* SVG Lever Mechanism */}
          <motion.div
            style={{ opacity: svgOpacity, y: svgY }}
            className="mt-8 sm:mt-12 w-full max-w-md mx-auto"
          >
            <svg
              ref={svgRef}
              viewBox="0 0 400 100"
              className="w-full overflow-visible"
              role="img"
              aria-label="Lever showing small effort producing large result"
            >
              {/* Fulcrum — off-center triangle at 35% */}
              <polygon
                points="140,36 126,70 154,70"
                className="fill-slate-200 dark:fill-slate-700"
              />

              {/* Beam group — rotates around fulcrum point (140, 30) */}
              <g transform="translate(140, 30)">
                <motion.g style={{ rotate: smoothBeam }}>
                  <g transform="translate(-140, -30)">
                    {/* Beam bar */}
                    <rect x="15" y="28" width="370" height="4" rx="2" className="fill-slate-300 dark:fill-slate-600" />

                    {/* Effort ball — small, on short arm */}
                    <circle cx="55" cy="18" r="10" className="fill-slate-300 dark:fill-slate-500" />

                    {/* Result ball — large, on long arm */}
                    <circle cx="330" cy="10" r="20" className="fill-blue-500 dark:fill-blue-400" />

                    {/* Result glow ring */}
                    <motion.circle
                      cx="330" cy="10" r="28"
                      fill="none"
                      className="stroke-blue-400 dark:stroke-blue-300"
                      strokeWidth="1.5"
                      style={{ opacity: resultGlow }}
                    />
                  </g>
                </motion.g>
              </g>

              {/* Labels — fixed position below mechanism */}
              <motion.g style={{ opacity: labelOpacity }}>
                <text
                  x="55" y="88" textAnchor="middle"
                  className="fill-slate-400 dark:fill-slate-500"
                  style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}
                >
                  effort
                </text>
                <text
                  x="330" y="88" textAnchor="middle"
                  className="fill-blue-500 dark:fill-blue-400"
                  style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  result
                </text>
              </motion.g>
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

/* ─── Final "asymmetric risks" hero moment — scroll-progress driven ─── */
const FinalStatement = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.25'],
  });

  /* "I'd rather take" — enters light and fast */
  const line1Opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const line1Y = useTransform(scrollYProgress, [0, 0.3], [30, 0]);

  /* "asymmetric" — enters heavy with spring overshoot */
  const asymWordOpacity = useTransform(scrollYProgress, [0.15, 0.45], [0, 1]);
  const asymWordY = useTransform(scrollYProgress, [0.15, 0.55], [80, 0]);
  const asymWordSpringY = useSpring(asymWordY, { stiffness: 180, damping: 12, mass: 1.5 });

  /* "risks." — snaps in after "asymmetric" lands */
  const risksOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);
  const risksY = useTransform(scrollYProgress, [0.5, 0.7], [15, 0]);

  /* Container micro-shake when "asymmetric" lands */
  const shakeX = useTransform(scrollYProgress, [0.52, 0.54, 0.56, 0.58], [0, -2, 2, 0]);
  const shakeY = useTransform(scrollYProgress, [0.52, 0.54, 0.56, 0.58], [0, 1, -1, 0]);

  /* Shockwave ring expands outward from "asymmetric" */
  const ringScale = useTransform(scrollYProgress, [0.48, 0.72], [0, 3]);
  const ringOpacity = useTransform(scrollYProgress, [0.48, 0.58, 0.72], [0, 0.2, 0]);

  /* Ambient glow */
  const glowOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);

  return (
    <div ref={ref} className="min-h-[85vh] sm:min-h-[100vh] flex items-center justify-center px-6">
      <motion.div style={{ x: shakeX, y: shakeY }} className="text-center relative">
        {/* Ambient glow */}
        <motion.div
          style={{ opacity: glowOpacity }}
          className="absolute -inset-16 sm:-inset-24 bg-blue-500/[0.08] dark:bg-blue-400/[0.12] rounded-full blur-[120px] pointer-events-none"
        />

        <div className="relative">
          {/* "I'd rather take" — light, fast */}
          <motion.p
            style={{ opacity: line1Opacity, y: line1Y }}
            className="font-playfair text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-slate-100 leading-tight"
          >
            I'd rather take
          </motion.p>

          {/* "asymmetric" — heavy weight drop */}
          <div className="relative inline-block mt-1">
            {/* Shockwave ring SVG */}
            <motion.svg
              style={{ opacity: ringOpacity, scale: ringScale }}
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
              viewBox="-50 -25 100 50"
            >
              <circle cx="0" cy="0" r="30" fill="none" strokeWidth="1"
                className="stroke-blue-400/60 dark:stroke-blue-300/60" />
            </motion.svg>

            <motion.span
              style={{ opacity: asymWordOpacity, y: asymWordSpringY }}
              className="font-playfair text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-blue-600 dark:text-blue-400 inline-block"
            >
              asymmetric
            </motion.span>
          </div>

          {/* "risks." — snaps in last */}
          <motion.span
            style={{ opacity: risksOpacity, y: risksY }}
            className="font-playfair text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-slate-100 inline-block ml-3 sm:ml-4"
          >
            risks.
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Single animated word — scroll-progress driven ─── */
const ScrollWord = ({ word, scrollYProgress, start, end }) => {
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y = useTransform(scrollYProgress, [start, end], [12, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block mr-[0.3em]">
      {word}
    </motion.span>
  );
};

/* ─── Per-letter wobble for "uncomfortable" ─── */
const UncomfortableLetter = ({ char, progress, offsetX, offsetScaleY, offsetRotate }) => {
  const x = useTransform(progress, [0.2, 0.32], [offsetX, 0]);
  const springX = useSpring(x, { stiffness: 300, damping: 12 });
  const scaleY = useTransform(progress, [0.2, 0.32], [offsetScaleY, 1]);
  const springScaleY = useSpring(scaleY, { stiffness: 300, damping: 12 });
  const rotate = useTransform(progress, [0.2, 0.32], [offsetRotate, 0]);
  const springRotate = useSpring(rotate, { stiffness: 300, damping: 12 });
  const opacity = useTransform(progress, [0.2, 0.28], [0, 1]);

  return (
    <motion.span
      style={{ x: springX, scaleY: springScaleY, rotate: springRotate, opacity, display: 'inline-block' }}
    >
      {char}
    </motion.span>
  );
};

/* ─── The Contrast — sticky scroll-locked ─── */
const ContrastSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const words1 = "But most people don't take them.".split(' ');
  const words2 = "Not because they can't".split(' ');

  /* "uncomfortable" reveal */
  const uncomfOpacity = useTransform(scrollYProgress, [0.2, 0.32], [0, 1]);

  /* Pre-computed letter offsets for "uncomfortable." wobble */
  const uncomfLetters = useMemo(() =>
    'uncomfortable.'.split('').map((char, i) => ({
      char,
      offsetX: Math.sin(i * 7.3 + 2.1) * 8,
      offsetScaleY: 1 + Math.cos(i * 5.7 + 1.3) * 0.05,
      offsetRotate: Math.sin(i * 4.1 + 3.7) * 3,
    }))
  , []);

  /* Brief warm flash during uncomfortable reveal */
  const warmFlash = useTransform(scrollYProgress, [0.2, 0.26, 0.32], [0, 0.04, 0]);

  /* "status quo" */
  const statusOpacity = useTransform(scrollYProgress, [0.32, 0.42], [0, 1]);

  /* Scale visual */
  const scaleVisOpacity = useTransform(scrollYProgress, [0.42, 0.52], [0, 1]);
  const scaleVisY = useTransform(scrollYProgress, [0.42, 0.52], [20, 0]);

  /* Left/right arms */
  const leftX = useTransform(scrollYProgress, [0.48, 0.58], [30, 0]);
  const leftOpacity = useTransform(scrollYProgress, [0.48, 0.58], [0, 1]);
  const rightX = useTransform(scrollYProgress, [0.48, 0.58], [-30, 0]);
  const rightOpacity = useTransform(scrollYProgress, [0.48, 0.58], [0, 1]);
  const pivotScale = useTransform(scrollYProgress, [0.46, 0.54], [0, 1]);

  /* Label */
  const labelOpacity = useTransform(scrollYProgress, [0.58, 0.68], [0, 1]);

  return (
    <div ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-2xl mx-auto space-y-10 sm:space-y-14">

        {/* Line 1: word-by-word stagger */}
        <div className="text-center">
          <p className="text-xl sm:text-2xl md:text-3xl text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            {words1.map((word, i) => (
              <ScrollWord
                key={`w1-${i}`}
                word={word}
                scrollYProgress={scrollYProgress}
                start={0.02 + (i / words1.length) * 0.1}
                end={0.02 + (i / words1.length) * 0.1 + 0.04}
              />
            ))}
          </p>
          <p className="text-xl sm:text-2xl md:text-3xl text-slate-700 dark:text-slate-200 leading-relaxed font-medium mt-1">
            {words2.map((word, i) => (
              <ScrollWord
                key={`w2-${i}`}
                word={word}
                scrollYProgress={scrollYProgress}
                start={0.1 + (i / words2.length) * 0.08}
                end={0.1 + (i / words2.length) * 0.08 + 0.04}
              />
            ))}
          </p>
        </div>

        {/* "because it's uncomfortable" — per-letter wobble with warm flash */}
        <div className="text-center space-y-2">
          <motion.p style={{ opacity: uncomfOpacity }} className="text-sm sm:text-base text-slate-400 dark:text-slate-500">
            but because it's
          </motion.p>
          <div className="relative inline-block">
            <motion.div style={{ opacity: warmFlash }} className="absolute -inset-4 bg-red-400/20 dark:bg-red-500/10 rounded-2xl pointer-events-none" />
            <p className="relative text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 dark:text-slate-100 tracking-tight inline-flex">
              {uncomfLetters.map((l, i) => (
                <UncomfortableLetter key={i} char={l.char} progress={scrollYProgress}
                  offsetX={l.offsetX} offsetScaleY={l.offsetScaleY} offsetRotate={l.offsetRotate} />
              ))}
            </p>
          </div>
        </div>

        {/* "So they choose the status quo" — faded, smaller */}
        <motion.p
          style={{ opacity: statusOpacity }}
          className="text-center text-base sm:text-lg text-slate-400 dark:text-slate-500"
        >
          So they choose the <span className="italic">status quo</span>.
        </motion.p>

        {/* Symmetric scale visual — SVG balanced beam (mirrors the lever, but level) */}
        <motion.div
          style={{ opacity: scaleVisOpacity, y: scaleVisY }}
          className="pt-4 sm:pt-8"
        >
          <div className="max-w-xs sm:max-w-sm mx-auto">
            <svg viewBox="0 0 400 80" className="w-full overflow-visible">
              {/* Fulcrum — centered at 50% (perfectly symmetric) */}
              <motion.polygon
                points="200,36 188,62 212,62"
                className="fill-slate-200 dark:fill-slate-700"
                style={{ scale: pivotScale, transformOrigin: '200px 50px' }}
              />
              {/* Beam — perfectly level */}
              <motion.rect
                x="40" y="28" width="320" height="4" rx="2"
                className="fill-slate-300 dark:fill-slate-600"
                style={{ opacity: leftOpacity }}
              />
              {/* Equal circles on each end — same size (symmetric) */}
              <motion.circle cx="80" cy="18" r="14"
                className="fill-slate-300 dark:fill-slate-500"
                style={{ x: leftX, opacity: leftOpacity }}
              />
              <motion.circle cx="320" cy="18" r="14"
                className="fill-slate-300 dark:fill-slate-500"
                style={{ x: rightX, opacity: rightOpacity }}
              />
              {/* Labels */}
              <motion.text x="80" y="75" textAnchor="middle"
                className="fill-slate-400 dark:fill-slate-500"
                style={{ opacity: leftOpacity, x: leftX, fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}
              >downside</motion.text>
              <motion.text x="320" y="75" textAnchor="middle"
                className="fill-slate-400 dark:fill-slate-500"
                style={{ opacity: rightOpacity, x: rightX, fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}
              >upside</motion.text>
            </svg>
          </div>

          {/* Label underneath */}
          <motion.p
            style={{ opacity: labelOpacity }}
            className="text-center text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-6 sm:mt-8 tracking-wider uppercase font-medium"
          >
            the most symmetric bet you can make
          </motion.p>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

/* ─── The bets — dealt rather than slid ───────────────────────────
   These two examples used to arrive on a SlideCard, one from the left and one
   from the right, which is the most generic scroll effect on the page and had
   nothing to do with what the cards say.

   The section is about placing small bets, so they are dealt: they come up
   from below at an angle and settle into a loose fanned stack, the way you
   would put two cards down on a table.
   ────────────────────────────────────────────────────────────── */
const BETS = [
  {
    action: 'Send an email to someone you admire.',
    worst: 'they ignore it.',
    best: 'it changes your career.',
    from: { y: 190, rotate: -9 },
    to: { rotate: -2.2 },
  },
  {
    action: 'Publish your ideas online.',
    worst: 'no one reads them.',
    best: 'the right person does.',
    from: { y: 230, rotate: 9 },
    to: { rotate: 2.4 },
  },
];

const DealtBet = ({ bet, i, progress, reduce }) => {
  const start = 0.08 + i * 0.13;
  const end = start + 0.2;
  const settle = { stiffness: 110, damping: 18 };

  const y = useSpring(useTransform(progress, [start, end], [bet.from.y, 0]), settle);
  const rotate = useSpring(
    useTransform(progress, [start, end], [bet.from.rotate, bet.to.rotate]),
    settle
  );
  const opacity = useTransform(progress, [start, start + 0.07], [0, 1]);

  const style = reduce ? {} : { y, rotate, opacity };

  return (
    <motion.div
      style={style}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800/60 sm:p-8"
    >
      <p className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100 sm:mb-5 sm:text-xl">
        {bet.action}
      </p>
      <div className="space-y-2 sm:space-y-3">
        <p className="flex items-start gap-3">
          <span className="text-lg text-slate-300 dark:text-slate-600 sm:text-xl">↓</span>
          <span>
            <span className="font-semibold text-slate-400 dark:text-slate-500">Worst case:</span>{' '}
            <span className="text-slate-500 dark:text-slate-400">{bet.worst}</span>
          </span>
        </p>
        <p className="flex items-start gap-3">
          <span className="text-lg text-blue-500 dark:text-blue-400 sm:text-xl">↑</span>
          <span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">Best case:</span>{' '}
            <span className="font-medium text-slate-800 dark:text-slate-100">{bet.best}</span>
          </span>
        </p>
      </div>
    </motion.div>
  );
};

const DealtBets = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  /* h-[180vh] unpins at (1.8 - 1) / 1.8 = 0.44; the second card lands by 0.41. */
  return (
    <div ref={ref} className="relative h-[180vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center px-6">
        <div className="mx-auto w-full max-w-2xl space-y-5 sm:space-y-6">
          {BETS.map((bet, i) => (
            <DealtBet key={bet.action} bet={bet} i={i} progress={scrollYProgress} reduce={reduce} />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Asymmetry — a payoff curve, drawn by scrolling ──────────────
   This beat used to be two boxes with a word in each, which meant the page
   described the shape of an asymmetric bet entirely in prose. That shape has
   a picture, and it is the picture Ethan's finance audience already reads.

   The floor is capped and short, so it draws almost instantly. The upside is
   unbounded, so it keeps climbing and runs off the top of the frame. The two
   halves are literally given different amounts of scroll, which is the whole
   argument in one gesture.
   ────────────────────────────────────────────────────────────── */
const AsymmetrySection = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  /* h-[190vh] unpins at (1.9 - 1) / 1.9 = 0.47. Everything lands by 0.44. */
  const introOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);
  const chartOpacity = useTransform(scrollYProgress, [0.06, 0.14], [0, 1]);
  const axisOpacity = useTransform(scrollYProgress, [0.1, 0.16], [0, 1]);

  /* Capped loss: a short flat run, over in a moment. */
  const floorDraw = useTransform(scrollYProgress, [0.16, 0.22], [0, 1]);
  const floorLabel = useTransform(scrollYProgress, [0.2, 0.26], [0, 1]);

  /* Uncapped gain: takes four times the scroll and leaves the frame. */
  const riseDraw = useTransform(scrollYProgress, [0.24, 0.44], [0, 1]);
  const fillOpacity = useTransform(scrollYProgress, [0.3, 0.44], [0, 1]);
  const riseLabel = useTransform(scrollYProgress, [0.38, 0.44], [0, 1]);

  const still = reduce ? 1 : undefined;

  return (
    <div ref={ref} className="relative h-[190vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center px-6">
        <div className="mx-auto w-full max-w-3xl">
          <motion.div style={{ opacity: reduce ? 1 : introOpacity }}>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500 sm:text-base">
              asymmetry matters
            </p>
            <p className="mt-3 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl">
              It&apos;s about placing
              <span className="mx-2 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200 sm:text-base">
                small bets
              </span>
              where the
            </p>
          </motion.div>

          <motion.div style={{ opacity: still ?? chartOpacity }} className="mt-8">
            <svg
              viewBox="0 0 460 300"
              className="w-full overflow-visible"
              role="img"
              aria-label="A payoff curve. The loss is capped at a shallow floor; the gain rises without limit and leaves the top of the frame."
            >
              <defs>
                <linearGradient id="upsideFill" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="rgb(37,99,235)" stopOpacity="0.02" />
                  <stop offset="100%" stopColor="rgb(37,99,235)" stopOpacity="0.22" />
                </linearGradient>
                <linearGradient id="riseStroke" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgb(96,165,250)" />
                  <stop offset="100%" stopColor="rgb(37,99,235)" />
                </linearGradient>
              </defs>

              {/* Break-even line */}
              <motion.line
                x1="18" y1="196" x2="452" y2="196"
                strokeWidth="1"
                strokeDasharray="3 5"
                className="stroke-slate-300 dark:stroke-slate-600"
                style={{ opacity: still ?? axisOpacity }}
              />
              <motion.text
                x="452" y="188" textAnchor="end"
                className="fill-slate-400 dark:fill-slate-500"
                style={{ opacity: still ?? axisOpacity, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase' }}
              >
                break even
              </motion.text>

              {/* Area under the upside */}
              <motion.path
                d="M 186 238 C 258 232, 338 140, 438 2 L 438 238 Z"
                fill="url(#upsideFill)"
                style={{ opacity: still ?? fillOpacity }}
              />

              {/* Capped floor */}
              <motion.path
                d="M 22 238 L 186 238"
                fill="none"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="stroke-slate-400 dark:stroke-slate-500"
                style={{ pathLength: still ?? floorDraw }}
              />

              {/* The cap itself */}
              <motion.path
                d="M 22 226 L 22 250"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                className="stroke-slate-400 dark:stroke-slate-500"
                style={{ opacity: still ?? floorLabel }}
              />

              {/* Uncapped rise, running off the top edge */}
              <motion.path
                d="M 186 238 C 258 232, 338 140, 438 2"
                fill="none"
                stroke="url(#riseStroke)"
                strokeWidth="4"
                strokeLinecap="round"
                style={{ pathLength: still ?? riseDraw }}
              />

              {/* Labels */}
              <motion.g style={{ opacity: still ?? floorLabel }}>
                <text
                  x="30" y="272"
                  className="fill-slate-400 dark:fill-slate-500"
                  style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase' }}
                >
                  downside
                </text>
                <text
                  x="30" y="292"
                  className="fill-slate-600 dark:fill-slate-300"
                  style={{ fontSize: '19px', fontWeight: 600 }}
                >
                  negligible
                </text>
              </motion.g>

              {/* Upper left, mirroring the downside labels at lower left, so the
                  two sit on the axis they describe. Anywhere nearer the curve
                  and the stroke runs straight through the word. */}
              <motion.g style={{ opacity: still ?? riseLabel }}>
                <text
                  x="26" y="74"
                  className="fill-blue-500 dark:fill-blue-300"
                  style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase' }}
                >
                  upside
                </text>
                <text
                  x="24" y="116"
                  className="fill-blue-700 dark:fill-blue-300"
                  style={{ fontSize: '36px', fontWeight: 600, letterSpacing: '-0.02em' }}
                >
                  enormous
                </text>
              </motion.g>
            </svg>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

/* ─── "everywhere" — the word does what the sentence claims ───────
   This beat used to be a single centred line fading in on an otherwise
   empty screen, which is the least the page does with a whole viewport.

   The sentence says these opportunities are everywhere, so the word
   multiplies: copies push outward from the centre as you scroll, at
   varying depth, until the screen is full of them. The claim is made by
   the layout rather than asserted by the copy.
   ────────────────────────────────────────────────────────────── */

/* Deterministic hash so the scatter is identical on every render and every
   reload. Math.random here would reshuffle on each paint. */
const scatter = (i, salt) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const EverywhereCopy = ({ i, progress, reduce }) => {
  const angle = scatter(i, 1) * Math.PI * 2;
  const dist = 26 + scatter(i, 2) * 34; // vw/vh from centre
  const rot = (scatter(i, 3) - 0.5) * 34;
  const scale = 0.4 + scatter(i, 4) * 0.55;
  const peak = 0.1 + scatter(i, 5) * 0.32;

  /* Each copy launches on its own beat, so they arrive as a spray rather
     than all at once. */
  const start = 0.16 + (i / 16) * 0.24;
  const end = start + 0.16;

  const x = useTransform(progress, [start, end], [0, Math.cos(angle) * dist]);
  const y = useTransform(progress, [start, end], [0, Math.sin(angle) * dist]);
  const opacity = useTransform(progress, [start, start + 0.06, end + 0.05], [0, peak, peak]);
  const s = useTransform(progress, [start, end], [0.25, scale]);

  const xv = useTransform(x, (v) => `${v}vw`);
  const yv = useTransform(y, (v) => `${v}vh`);

  if (reduce) return null;

  return (
    <motion.span
      aria-hidden="true"
      style={{ x: xv, y: yv, opacity, scale: s, rotate: rot }}
      className="pointer-events-none absolute select-none whitespace-nowrap font-playfair italic text-2xl text-slate-500 dark:text-slate-400 sm:text-3xl md:text-4xl"
    >
      everywhere
    </motion.span>
  );
};

const EverywhereSection = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  /* h-[190vh] unpins at (1.9 - 1) / 1.9 = 0.47, so the spray lands before then. */
  const lineOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const lineScale = useTransform(scrollYProgress, [0.16, 0.45], [1, 0.9]);

  const copies = useMemo(() => Array.from({ length: 16 }, (_, i) => i), []);

  return (
    <div ref={ref} className="relative h-[190vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6">
        <div className="relative flex items-center justify-center">
          {copies.map((i) => (
            <EverywhereCopy key={i} i={i} progress={scrollYProgress} reduce={reduce} />
          ))}

          <motion.p
            style={{ opacity: lineOpacity, scale: lineScale }}
            className="relative z-10 max-w-2xl text-center text-xl leading-relaxed text-slate-700 dark:text-slate-200 sm:text-2xl md:text-3xl"
          >
            The strange thing is that these opportunities are{' '}
            <span className="font-playfair italic text-slate-900 dark:text-slate-50">
              everywhere
            </span>
            .
          </motion.p>
        </div>
      </div>
    </div>
  );
};

/* ─── The ratio — scroll drives the fraction it is describing ─────
   This section argues that every action should "maximize the ratio of
   results / effort", and the fraction underneath it used to be static text
   inside a plain fade-in, followed by a hard-coded 26rem spacer of dead air.
   The page asked for a lot of scroll here and did nothing with it.

   Now the scroll performs the sentence: results grows, effort shrinks and
   dims, and the dividing rule stretches with the numerator. By the time you
   reach the bottom of the pin, the ratio has visibly been maximised.
   ────────────────────────────────────────────────────────────── */
const RatioSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const spring = { stiffness: 90, damping: 26 };

  /* h-[210vh] means the sticky child unpins at (2.1 - 1) / 2.1 = 0.52, so every
     beat lands before then. Anything scheduled past that plays while the text
     is already sliding off screen. */
  const introOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);
  const maximizeOpacity = useTransform(scrollYProgress, [0.05, 0.14], [0, 1]);
  const fractionOpacity = useTransform(scrollYProgress, [0.12, 0.2], [0, 1]);

  /* The numerator climbs, the denominator collapses. */
  const resultsScale = useSpring(
    useTransform(scrollYProgress, [0.22, 0.5], [1, 1.75]),
    spring
  );
  const effortScale = useSpring(
    useTransform(scrollYProgress, [0.22, 0.5], [1, 0.55]),
    spring
  );
  const effortOpacity = useTransform(scrollYProgress, [0.22, 0.5], [1, 0.4]);
  const ruleWidth = useSpring(
    useTransform(scrollYProgress, [0.22, 0.5], [140, 260]),
    spring
  );
  const ruleWidthPx = useTransform(ruleWidth, (v) => `${v}px`);

  return (
    <div ref={ref} className="relative h-[210vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 text-center sm:gap-14">
          <motion.p
            style={{ opacity: introOpacity }}
            className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl md:text-2xl"
          >
            Every{' '}
            <motion.span
              animate={{ rotate: [0, -5, 4, -3, 0], y: [0, -4, 2, -2, 0], scale: [1, 1.08, 1.03, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.1, ease: 'easeInOut' }}
              className="inline-block font-semibold text-slate-800 dark:text-slate-100"
            >
              action
            </motion.span>{' '}
            should
          </motion.p>

          <motion.p
            style={{ opacity: maximizeOpacity }}
            className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl md:text-6xl"
          >
            maximize
          </motion.p>

          <motion.div
            style={{ opacity: fractionOpacity }}
            className="flex flex-col items-center gap-6 sm:gap-8"
          >
            <p className="text-sm uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500 sm:text-base">
              the ratio of
            </p>

            <div className="inline-flex flex-col items-center leading-none">
              <motion.span
                style={{ scale: resultsScale }}
                className="block origin-bottom text-2xl font-semibold text-slate-800 dark:text-slate-100 sm:text-3xl md:text-4xl"
              >
                results
              </motion.span>

              <motion.span
                style={{ width: ruleWidthPx }}
                className="my-3 block h-px bg-slate-300 dark:bg-slate-600"
              />

              <motion.span
                style={{ scale: effortScale, opacity: effortOpacity }}
                className="block origin-top text-2xl font-semibold text-slate-500 dark:text-slate-400 sm:text-3xl md:text-4xl"
              >
                effort
              </motion.span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

/* ─── Fade-in wrapper — scroll-progress driven ─── */
const FadeInBlock = ({ children, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.6'],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ opacity, y }}>
        {children}
      </motion.div>
    </div>
  );
};

/* ─── Hobbies grid with click-to-expand ─── */
const HobbiesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px -5% 0px' });
  const [activeHobby, setActiveHobby] = useState(null);

  /* The jiu jitsu card rendered as an empty white box until the 6.9MB mp4
     finished downloading. A poster frame gives it something to show. */
  const hobbies = [
    { type: 'video', src: '/images/jiujitsu.mp4', poster: '/images/jiujitsu-poster.jpg', label: 'jiu jitsu' },
    { type: 'img', src: '/images/badminton.jpg', label: 'badminton' },
    { type: 'img', src: '/images/hockey.jpg', label: 'hockey' },
    { type: 'img', src: '/images/investing.jpg', label: 'investing' },
  ];

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 dark:border-slate-800">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 sm:mb-6 flex items-center gap-2">
            <span className="text-blue-500 dark:text-blue-400">✦</span> hobbies
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {hobbies.map((hobby, i) => (
              <motion.div
                key={hobby.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="group cursor-pointer bg-white dark:bg-slate-900/50 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                onClick={() => setActiveHobby(hobby)}
                data-hover
              >
                <div className="aspect-square relative overflow-hidden">
                  {hobby.type === 'video' ? (
                    <video src={hobby.src} poster={hobby.poster} preload="metadata" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" autoPlay loop muted playsInline />
                  ) : (
                    <img src={hobby.src} alt={hobby.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <div className="p-3 sm:p-4 text-center">
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">{hobby.label}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Fullscreen modal overlay */}
      <AnimatePresence>
        {activeHobby && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveHobby(null)}
          >
            <motion.div
              className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-square sm:aspect-[4/3] relative overflow-hidden">
                {activeHobby.type === 'video' ? (
                  <video src={activeHobby.src} poster={activeHobby.poster} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                ) : (
                  <img src={activeHobby.src} alt={activeHobby.label} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">{activeHobby.label}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Quick facts with fade-in ─── */
const QuickFacts = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px -5% 0px' });

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 dark:border-slate-800">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span className="text-blue-500 dark:text-blue-400">✦</span> quick facts
          </h2>
          <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm sm:text-base">
            <li className="flex items-start gap-3">
              <span className="text-blue-500 dark:text-blue-400 text-xl">→</span>
              <span>I speak 2.5 languages (english, chinese, and learning french)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 dark:text-blue-400 text-xl">→</span>
              <span>my favourite dish is eggs and tomatoes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-500 dark:text-blue-400 text-xl">→</span>
              <span>I enjoy snowboarding in the Rockies (love sunshine)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 dark:text-blue-400 text-xl">→</span>
              <span>1400 rapid chess - <a href="https://www.chess.com/member/xxhyperinsanexx" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline" data-hover>challenge me!</a></span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── Scroll-driven ambient atmosphere for about page ─── */
const AboutAtmosphere = () => {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [30, 65, 35, 60, 45]);
  const y = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [20, 50, 65, 30, 45]);
  const x2 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [70, 35, 65, 40, 55]);
  const y2 = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [65, 30, 35, 70, 50]);
  const op = useTransform(scrollYProgress, [0, 0.03, 0.9, 1], [0, 1, 1, 0]);
  const bg = useMotionTemplate`radial-gradient(circle at ${x}% ${y}%, rgba(96, 165, 250, 0.06), rgba(96, 165, 250, 0) 85%), radial-gradient(circle at ${x2}% ${y2}%, rgba(59, 130, 246, 0.04), rgba(59, 130, 246, 0) 80%)`;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{ opacity: op, background: bg }}
    />
  );
};


/* ════════════════════════════════════════
   ABOUT — the scroll narrative

   Left structurally as it was. This is the strongest thing on the site and
   the pacing was deliberate: the vortex assembling the sentence, the judo
   quote drawing character by character, the lever tilting to both scroll and
   cursor, the upside/downside cards sized to encode the asymmetry they
   describe, and the same lever returning perfectly level as "the most
   symmetric bet you can make".

   Only two things changed: the timings at the top of ObsessionStatement and
   ContrastSection, which each had a run-up of roughly one blank screen.
   ════════════════════════════════════════ */
const About = () => (
  <>
    <AboutAtmosphere />
    <motion.div
      className="relative z-[1]"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* 1 — Hero quote */}
      <HeroQuote />

      {/* 2 — "I'm obsessed with this idea." */}
      <ObsessionStatement />

      {/* 3 — The judo principle */}
      <JudoQuote />

      {/* 4 — Leverage */}
      <LeverageSection />

      {/* 5 — results / effort */}
      <RatioSection />

      {/* Asymmetry: a payoff curve drawn by scrolling. */}
      <AsymmetrySection />

      {/* 6 — Worked examples, dealt like cards */}
      <DealtBets />


      {/* 7 — The turn */}
      <EverywhereSection />

      {/* 8 — Why people don't take them, and the level lever */}
      <ContrastSection />

      {/* 9 — Payoff */}
      <FinalStatement />

      {/* 10 — Who I am away from the argument */}
      <div className="px-6">
        <div className="max-w-2xl mx-auto space-y-8 sm:space-y-12 pb-8">
          <ScrollSection height="min-h-[20vh]">
            <div className="flex justify-center">
              <div className="w-12 h-px bg-slate-300 dark:bg-slate-700" />
            </div>
          </ScrollSection>

          <FadeInBlock>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              about me
            </h2>
          </FadeInBlock>

          <HobbiesSection />
          <QuickFacts />
        </div>
      </div>
    </motion.div>
  </>
);

/* ════════════════════════════════════════
   SHELL
   ════════════════════════════════════════ */
const Portfolio = () => {
  const [route, navigate] = useHashRoute();
  const [easterEgg, setEasterEgg] = useState(false);

  /* Respect the OS preference on first load, then let the toggle win.
     matchMedia is guarded: jsdom does not implement it, and an unguarded call
     here takes the whole app down in tests rather than just losing the
     preference. */
  const [darkMode, setDarkMode] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  /* The pointer-following backdrop used to live in useState, so every single
     mousemove re-rendered the whole page. Motion values keep it off the React
     render path entirely. */
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });
  const bgX = useTransform(smx, (v) => `${v * 100}%`);
  const bgY = useTransform(smy, (v) => `${v * 100}%`);
  const tint = darkMode ? 'rgba(51, 65, 85, 0.40)' : 'rgba(219, 234, 254, 0.60)';
  const backdrop = useMotionTemplate`radial-gradient(ellipse 80% 60% at ${bgX} ${bgY}, ${tint}, rgba(0,0,0,0) 100%)`;

  const onPointerMove = useCallback(
    (e) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    },
    [mx, my]
  );

  useEffect(() => {
    window.addEventListener('mousemove', onPointerMove, { passive: true });

    console.log(
      '%c👋 hi, you found the console!',
      'font-size: 20px; font-weight: bold; color: #2563eb;'
    );
    console.log(
      "%cif you're a recruiter reading this let's talk → info@ethanzhou.ca",
      'font-size: 14px; color: #2563eb;'
    );

    let buffer = '';
    const onKey = (e) => {
      buffer = (buffer + e.key.toLowerCase()).slice(-10);
      if (buffer.includes('hire')) {
        setEasterEgg(true);
        buffer = '';
        setTimeout(() => setEasterEgg(false), 5000);
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [onPointerMove]);

  return (
    <div className="min-h-[100dvh] bg-slate-50 font-sans text-slate-900 transition-colors duration-500 dark:bg-slate-950 dark:text-slate-100">
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: backdrop }}
        aria-hidden="true"
      />

      <CustomCursor />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-slate-900 focus:px-5 focus:py-2.5 focus:text-sm focus:text-white dark:focus:bg-slate-50 dark:focus:text-slate-900"
      >
        Skip to content
      </a>

      <AnimatePresence>
        {easterEgg && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-full border border-slate-200 bg-white px-6 py-3 shadow-card-hover dark:border-slate-700 dark:bg-slate-900"
          >
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              🎉 you typed &quot;hire&quot;. i like where this is going →{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                info@ethanzhou.ca
              </span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <Nav
          route={route}
          navigate={navigate}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main id="main">
          {/* No AnimatePresence here on purpose. `mode="wait"` keeps the
              outgoing page mounted until its exit finishes, which meant a
              click on "about" left the work page on screen. A keyed fade-in
              gives the same feel with none of the handover risk, and the new
              route is in the DOM immediately for anchors and screen readers. */}
          <motion.div
            key={route}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {route === 'home' && <Home navigate={navigate} />}
            {route === 'work' && <Work />}
            {route === 'content' && <Content />}
            {route === 'about' && <About />}
          </motion.div>
        </main>

        <footer className="mx-auto max-w-5xl px-6 pb-12 pt-8">
          <div className="flex flex-col items-center gap-5 border-t border-slate-200 pt-10 dark:border-slate-800 sm:flex-row sm:justify-between">
            <div className="text-sm text-slate-400 dark:text-slate-600">
              © {new Date().getFullYear()} ethan zhou
            </div>
            <div className="flex gap-5">
              {[
                { href: 'mailto:info@ethanzhou.ca', Icon: Mail, label: 'Email' },
                { href: 'https://instagram.com/ethanzhouwealth', Icon: Instagram, label: 'Instagram' },
                { href: 'https://www.youtube.com/@Ethanzhouwealth', Icon: Youtube, label: 'YouTube' },
                { href: 'https://www.linkedin.com/in/ethan-zhou-832565315/', Icon: Linkedin, label: 'LinkedIn' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  data-hover
                  className="text-slate-400 transition-colors hover:text-slate-900 dark:text-slate-600 dark:hover:text-slate-200"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Portfolio;
