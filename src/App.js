import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { Users, Eye, Mail, Instagram, Linkedin, Youtube, BarChart3, ArrowRight, Sun, Moon } from 'lucide-react';

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

/* ─── Card that slides in from left or right — scroll-progress driven ─── */
const SlideCard = ({ children, from = 'left', delay = 0, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.4'],
  });
  const xStart = from === 'left' ? -80 : 80;
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [xStart, 0]);

  return (
    <div ref={ref}>
      <motion.div style={{ opacity, x }} className={className}>
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

  const introOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
  const introY = useTransform(scrollYProgress, [0.05, 0.2], [15, 0]);

  const quote = '"maximum efficient use of energy"';
  const chars = quote.split('');

  /* Brush underline draws in after text is revealed */
  const underlineScale = useTransform(scrollYProgress, [0.7, 0.85], [0, 1]);
  const smoothUnderline = useSpring(underlineScale, { stiffness: 120, damping: 30 });

  return (
    <div ref={ref} className="relative h-[350vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-4 sm:space-y-6 max-w-2xl">
          <motion.p
            style={{ opacity: introOpacity, y: introY }}
            className="text-slate-500 dark:text-slate-400 text-sm sm:text-base md:text-lg"
          >
            It's similar to a concept we use in Judo:
          </motion.p>
          <p className="font-playfair italic text-2xl sm:text-3xl md:text-4xl text-slate-700 dark:text-slate-200 leading-snug relative inline-block">
            {chars.map((char, i) => {
              const start = 0.2 + (i / chars.length) * 0.45;
              const end = start + 0.45 / chars.length + 0.06;
              return (
                <JudoChar key={i} char={char} progress={scrollYProgress} start={start} end={end} />
              );
            })}
            {/* Brush-stroke underline */}
            <motion.span
              style={{ scaleX: smoothUnderline, transformOrigin: 'left' }}
              className="absolute -bottom-2 left-[5%] right-[5%] h-[3px] rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 opacity-60"
            />
          </p>
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
  const words2 = 'Not because they cant'.split(' ');

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

  const hobbies = [
    { type: 'video', src: '/images/jiujitsu.mp4', label: 'jiu jitsu' },
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
                    <video src={hobby.src} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" autoPlay loop muted playsInline />
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
                  <video src={activeHobby.src} className="w-full h-full object-cover" autoPlay loop muted playsInline />
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
              <span className="text-teal-500 dark:text-teal-400 text-xl">→</span>
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

/* ─── Custom cursor component ─── */
const CustomCursor = () => {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const visible = useRef(true);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      visible.current = true;
    };
    const onLeave = () => { visible.current = false; };
    const onEnter = () => { visible.current = true; };

    const checkHover = () => {
      const el = document.elementFromPoint(pos.current.x, pos.current.y);
      hovering.current = el && (el.closest('a') || el.closest('button') || el.closest('[data-hover]'));
    };

    let raf;
    const animate = () => {
      if (cursorRef.current && ringRef.current) {
        cursorRef.current.style.left = `${pos.current.x}px`;
        cursorRef.current.style.top = `${pos.current.y}px`;
        cursorRef.current.style.opacity = visible.current ? 1 : 0;

        ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
        ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
        ringRef.current.style.opacity = visible.current ? 1 : 0;

        checkHover();
        cursorRef.current.className = `custom-cursor${hovering.current ? ' hovering' : ''}`;
        ringRef.current.className = `cursor-ring${hovering.current ? ' hovering' : ''}`;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

/* ─── Magnetic button component ─── */
const MagneticButton = ({ children, className = '', ...props }) => {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  };

  const handleMouseLeave = () => {
    if (btnRef.current) btnRef.current.style.transform = 'translate(0, 0)';
  };

  return (
    <div
      ref={btnRef}
      className="magnetic-btn inline-block"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {React.cloneElement(children, { className: `${children.props.className || ''} ${className}` , ...props })}
    </div>
  );
};

/* ─── Proximity text — letters react to cursor ─── */
const ProximityText = ({ text, className = '' }) => {
  const containerRef = useRef(null);
  const lettersRef = useRef([]);
  const mouse = useRef({ x: -1000, y: -1000 });
  const rafId = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    const animate = () => {
      lettersRef.current.forEach((el) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouse.current.x - cx;
        const dy = mouse.current.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 120;

        if (dist < maxDist) {
          const strength = 1 - dist / maxDist;
          const scale = 1 + strength * 0.2;
          const moveX = (dx / dist) * strength * 4;
          const moveY = (dy / dist) * strength * 4;
          el.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
        } else {
          el.style.transform = 'translate(0, 0) scale(1)';
        }
      });
      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const letters = text.split('');

  return (
    <span ref={containerRef} className={className}>
      {letters.map((char, i) => (
        <span
          key={i}
          ref={(el) => (lettersRef.current[i] = el)}
          className="proximity-letter"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

/* ─── Stagger wrapper — auto-staggers children on mount ─── */
const StaggerContainer = ({ children, baseDelay = 0, stagger = 0.12 }) => {
  return (
    <>
      {React.Children.map(children, (child, i) => {
        if (!React.isValidElement(child)) return child;
        return (
          <div className="stagger-item" style={{ animationDelay: `${baseDelay + i * stagger}s` }}>
            {child}
          </div>
        );
      })}
    </>
  );
};

/* ─── Flip card photo component ─── */
const FlipPhoto = () => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const inner = card.querySelector('.flip-card-inner');
    if (inner) {
      inner.style.transform = `rotateY(180deg) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateZ(10px)`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    const inner = card.querySelector('.flip-card-inner');
    if (inner) inner.style.transform = '';
  };

  return (
    <div
      ref={cardRef}
      className="flip-card w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 float-animation"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-hover
    >
      <div className="flip-card-inner shadow-xl rounded-full border-4 border-white">
        <div className="flip-card-front">
          <img src="/images/seriousheadshot.JPG" alt="Ethan Zhou" className="w-full h-full object-cover" />
        </div>
        <div className="flip-card-back">
          <img src="/images/headshot.jpg" alt="Ethan Zhou casual" className="w-full h-full object-cover" />
        </div>
      </div>
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
   MAIN PORTFOLIO COMPONENT
   ════════════════════════════════════════ */
const Portfolio = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mounted, setMounted] = useState(false);
  const [easterEgg, setEasterEgg] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  /* Scroll to top on tab change — essential for scroll-driven about page */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  /* Track mouse for gradient background */
  const handleGlobalMouse = useCallback((e) => {
    setMousePos({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    });
  }, []);

  useEffect(() => {
    setMounted(true);
    window.addEventListener('mousemove', handleGlobalMouse);

    // Easter egg console messages
    console.log('%c👋 hi, you found the console!', 'font-size: 20px; font-weight: bold; color: #2563eb;');
    console.log('%cif you\'re a recruiter reading this let\'s talk → info@ethanzhou.ca', 'font-size: 14px; color: #0d9488;');

    // Type "hire" easter egg
    let buffer = '';
    const handleKeyPress = (e) => {
      buffer += e.key.toLowerCase();
      if (buffer.length > 10) buffer = buffer.slice(-10);
      if (buffer.includes('hire')) {
        setEasterEgg(true);
        buffer = '';
        setTimeout(() => setEasterEgg(false), 5000);
      }
    };
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouse);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleGlobalMouse]);

  const experience = [
    {
      role: 'Marketing & Business Strategy Intern',
      company: 'United Lifts Technologies',
      period: 'April 2025 – Present',
      location: 'Calgary',
      impact: '+256%',
      metric: 'LinkedIn Growth',
      highlights: [
        'Edited 10+ website pages improving UX and SEO',
        'Improved search rankings by 38%',
        'Increased LinkedIn engagement by 256%',
        'Led marketing strategy initiatives'
      ]
    },
    {
      role: 'Content Creator',
      company: '@ethanzhouwealth',
      period: 'August 2023 – Present',
      location: 'Instagram & TikTok',
      impact: '10M+',
      metric: 'Total Views',
      highlights: [
        'Created 150+ educational finance videos',
        'Generated 10M+ views across platforms',
        'Built audience of 22,000+ followers',
        'Focus on investing & personal finance'
      ]
    }
  ];

  /* Interactive gradient — the ONLY gradient on the page */
  const gradientStyle = {
    background: `radial-gradient(
      ellipse 80% 60% at ${mousePos.x * 100}% ${mousePos.y * 100}%,
      ${darkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(219, 234, 254, 0.6)'},
      ${darkMode ? 'rgba(15, 23, 42, 0)' : 'rgba(248, 250, 252, 0)'}
    )`,
    transition: 'background 0.3s ease',
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
    <div className={`min-h-screen font-inter ${darkMode ? 'bg-slate-950' : 'bg-slate-50'} transition-colors duration-500`}>

      {/* Mouse-following gradient overlay */}
      <div className="fixed inset-0 pointer-events-none z-0" style={gradientStyle} />

      <CustomCursor />

      {/* 
        Hey recruiter 👋 — yes, I hand-coded this portfolio.
        React + Tailwind CSS. No templates. No page builders.
        If you're reading this, let's grab coffee → info@ethanzhou.ca
      */}

      {/* Easter egg toast */}
      {easterEgg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg border border-slate-200 dark:border-gray-700 animate-bounce">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">🎉 you typed "hire" i like where this is going! → <span className="text-blue-600 dark:text-blue-400 font-semibold">info@ethanzhou.ca</span></span>
        </div>
      )}

      <div className="relative z-10">
      <header className="max-w-4xl mx-auto px-6 py-8">
        <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 mb-12">
          <button
            onClick={() => setActiveTab('overview')}
            className="text-2xl font-bold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-95 active:scale-90 transition-all duration-200"
          >
            ethan zhou
          </button>
          <div className="flex flex-wrap justify-center items-center gap-2">
            {['about', 'projects', 'social media'].map((tab) => {
              const key = tab === 'social media' ? 'media' : tab;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 text-sm ${
                    activeTab === key
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200 active:scale-95'
                  }`}
                >
                  {tab}
                </button>
              );
            })}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="ml-1 px-2.5 py-2 rounded-lg transition-all duration-300 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 active:scale-95"
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {/* ═══ HERO / OVERVIEW — redesigned ═══ */}
        {activeTab === 'overview' && (
          <div className={`transition-all duration-700 min-h-0 md:min-h-[calc(100vh-200px)] flex flex-col justify-center items-center ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

            {/* Flip Photo */}
            <div className="mb-8 sm:mb-10 md:mb-14 stagger-item" style={{ animationDelay: '0.1s' }}>
              <FlipPhoto />
            </div>

            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              {/* Main heading — handwritten font, solid color, proximity effect */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-caveat font-bold mb-4 md:mb-6 text-slate-800 dark:text-slate-100 stagger-item" style={{ animationDelay: '0.3s' }}>
                <ProximityText text="hey there, i'm ethan!" />
              </h1>

              {/* Subtitle — clean, minimal */}
              <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 md:mb-14 stagger-item" style={{ animationDelay: '0.5s' }}>
                eng student who makes things on the internet
              </p>

              {/* CTA Buttons — solid colors, no gradients, magnetic */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 px-4 stagger-item" style={{ animationDelay: '0.7s' }}>
                <MagneticButton>
                  <a
                    href="mailto:info@ethanzhou.ca"
                    className="flex items-center justify-center gap-2 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 px-7 py-3.5 rounded-full font-medium shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                    data-hover
                  >
                    <Mail className="w-4 h-4" />
                    let's connect!
                  </a>
                </MagneticButton>
                <MagneticButton>
                  <a
                    href="https://instagram.com/ethanzhouwealth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-7 py-3.5 rounded-full font-medium shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-slate-200 dark:border-slate-700"
                    data-hover
                  >
                    <Instagram className="w-4 h-4" />
                    @ethanzhouwealth
                  </a>
                </MagneticButton>
                <MagneticButton>
                  <a
                    href="https://www.linkedin.com/in/ethan-zhou-832565315/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-7 py-3.5 rounded-full font-medium shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-slate-200 dark:border-slate-700"
                    data-hover
                  >
                    <Linkedin className="w-4 h-4" />
                    linkedin
                  </a>
                </MagneticButton>
              </div>
            </div>
          </div>
        )}

        {/* ═══ ABOUT — Scroll-driven storytelling ═══ */}
        {activeTab === 'about' && (
          <>
          <AboutAtmosphere />
          <motion.div
            className="-mx-6 -mt-4 relative z-[1]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >

            {/* Section 1: Hero Quote — full viewport, fades/scales on scroll */}
            <HeroQuote />

            {/* Section 2: Obsession Statement */}
            <ObsessionStatement />

            {/* Section 3: Judo Connection */}
            <JudoQuote />

            {/* Section 4: Leverage — scroll fade-in */}
            <LeverageSection />

            {/* Section 5: Philosophy Explanation */}
            <ScrollSection height="min-h-[120vh] sm:min-h-[140vh] md:min-h-[160vh]">
              <div className="text-center max-w-3xl mx-auto space-y-12 sm:space-y-16 md:space-y-20 py-16 sm:py-24 md:py-32">
                <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Every{' '}
                  <motion.span
                    animate={{ rotate: [0, -5, 4, -3, 0], y: [0, -4, 2, -2, 0], scale: [1, 1.08, 1.03, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.1, ease: 'easeInOut' }}
                    className="inline-block font-semibold text-slate-800 dark:text-slate-100"
                  >
                    action
                  </motion.span>{' '}
                  should
                </p>

                <p className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  maximize
                </p>

                <div className="flex flex-col items-center gap-8 sm:gap-12 md:gap-16">
                  <p className="text-sm sm:text-base md:text-lg uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                    the ratio of
                  </p>
                  <div className="inline-flex flex-col items-center leading-none">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-800 dark:text-slate-100">
                      results
                    </span>
                    <span className="my-2 h-px w-28 sm:w-36 md:w-44 bg-slate-300 dark:bg-slate-600" />
                    <span className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-500 dark:text-slate-400">
                      effort
                    </span>
                  </div>
                </div>

                <div className="pt-52 sm:pt-72 md:pt-[26rem]">
                  <div className="mx-auto max-w-3xl px-2 sm:px-4">
                    <p className="text-sm sm:text-base md:text-lg uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                      asymmetry matters
                    </p>
                    <p className="mt-3 text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed sm:leading-loose">
                      It&apos;s about placing
                      <span className="mx-2 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-sm sm:text-base text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        small bets
                      </span>
                      where the
                    </p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-[2.15fr_0.85fr] sm:gap-5 items-end">
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
                        className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-6 sm:px-6 sm:py-7 text-left overflow-hidden dark:border-blue-500/20 dark:bg-blue-500/10"
                      >
                        <p className="text-xs uppercase tracking-[0.22em] text-blue-500 dark:text-blue-300">upside</p>
                        <p className="mt-3 text-[clamp(2.1rem,6.2vw,4rem)] leading-[0.98] font-semibold tracking-tight text-blue-700 dark:text-blue-300">enormous</p>
                      </motion.div>
                      <motion.div
                        animate={{ y: [0, 4, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut', delay: 0.2 }}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left self-end dark:border-slate-700 dark:bg-slate-800/70"
                      >
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">downside</p>
                        <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-semibold text-slate-700 dark:text-slate-200">negligible</p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollSection>

            {/* Section 6: Example Callout Cards */}
            <div className="min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center px-6">
              <div className="w-full max-w-2xl mx-auto space-y-6 sm:space-y-8">
                <SlideCard from="left" delay={0}>
                  <div className="rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-lg">
                    <p className="text-slate-800 dark:text-slate-100 text-lg sm:text-xl font-semibold mb-4 sm:mb-5">
                      Send an email to someone you admire.
                    </p>
                    <div className="space-y-2 sm:space-y-3">
                      <p className="flex items-start gap-3">
                        <span className="text-slate-300 dark:text-slate-600 text-lg sm:text-xl">↓</span>
                        <span><span className="font-semibold text-slate-400 dark:text-slate-500">Worst case:</span>{' '}<span className="text-slate-500 dark:text-slate-400">they ignore it.</span></span>
                      </p>
                      <p className="flex items-start gap-3">
                        <span className="text-blue-500 dark:text-blue-400 text-lg sm:text-xl">↑</span>
                        <span><span className="font-semibold text-blue-600 dark:text-blue-400">Best case:</span>{' '}<span className="text-slate-800 dark:text-slate-100 font-medium">it changes your career.</span></span>
                      </p>
                    </div>
                  </div>
                </SlideCard>

                <SlideCard from="right" delay={0.15}>
                  <div className="rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-lg">
                    <p className="text-slate-800 dark:text-slate-100 text-lg sm:text-xl font-semibold mb-4 sm:mb-5">
                      Publish your ideas online.
                    </p>
                    <div className="space-y-2 sm:space-y-3">
                      <p className="flex items-start gap-3">
                        <span className="text-slate-300 dark:text-slate-600 text-lg sm:text-xl">↓</span>
                        <span><span className="font-semibold text-slate-400 dark:text-slate-500">Worst case:</span>{' '}<span className="text-slate-500 dark:text-slate-400">no one reads them.</span></span>
                      </p>
                      <p className="flex items-start gap-3">
                        <span className="text-blue-500 dark:text-blue-400 text-lg sm:text-xl">↑</span>
                        <span><span className="font-semibold text-blue-600 dark:text-blue-400">Best case:</span>{' '}<span className="text-slate-800 dark:text-slate-100 font-medium">the right person does.</span></span>
                      </p>
                    </div>
                  </div>
                </SlideCard>
              </div>
            </div>

            {/* Section 7: The Reality */}
            <ScrollSection height="min-h-[60vh] sm:min-h-[70vh]">
              <div className="text-center space-y-6 sm:space-y-8">
                <p className="text-xl sm:text-2xl md:text-3xl text-slate-700 dark:text-slate-200 leading-relaxed">
                  The strange thing is that these opportunities are everywhere.
                </p>
              </div>
            </ScrollSection>

            {/* Section 8: The Contrast — animated reveal */}
            <ContrastSection />

            {/* Section 9: Final Statement — hero moment */}
            <FinalStatement />

            {/* Section 10: Transition to About Me + Hobbies */}
            <div className="px-6">
              <div className="max-w-2xl mx-auto space-y-8 sm:space-y-12 pb-8">

                {/* Divider */}
                <ScrollSection height="min-h-[20vh]">
                  <div className="flex justify-center">
                    <div className="w-12 h-px bg-slate-300 dark:bg-slate-700" />
                  </div>
                </ScrollSection>

                {/* About Me heading */}
                <FadeInBlock>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100">
                    <span className="text-blue-500 dark:text-blue-400">✦</span> about me
                  </h1>
                </FadeInBlock>

                {/* Hobbies */}
                <HobbiesSection />

                {/* Quick Facts */}
                <QuickFacts />

              </div>
            </div>

          </motion.div>
          </>
        )}

        {/* ═══ PROJECTS ═══ */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <StaggerContainer stagger={0.15}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-slate-800 dark:text-slate-100">
              <span className="text-blue-500 dark:text-blue-400">✦</span> projects
            </h1>

            <div className="bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow duration-300 max-w-2xl mx-auto">
              <a href="https://explain-my-code-w3sj.onrender.com/" target="_blank" rel="noopener noreferrer" className="block" data-hover>
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <video src="/images/explain-my-code.mp4" className="w-full h-full object-cover" autoPlay loop muted playsInline />
                </div>
              </a>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Explain my Code</h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4">
                  can explain a code to a 5 year old
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium">AI</span>
                  <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-xs rounded-full font-medium">Education</span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full font-medium">Web App</span>
                </div>
                <a href="https://explain-my-code-w3sj.onrender.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors" data-hover>
                  visit project
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            </StaggerContainer>
          </div>
        )}

        {/* ═══ EXPERIENCE (hidden tab) ═══ */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="stagger-item" style={{ animationDelay: '0s' }}>
              <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-slate-800 dark:text-slate-100">
                <span className="text-blue-500 dark:text-blue-400">✦</span> my experience
              </h1>
            </div>
            {experience.map((exp, index) => (
              <div key={index} className="stagger-item bg-white dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-100 dark:border-slate-800" style={{ animationDelay: `${0.1 + index * 0.15}s` }}>
                <div className="flex flex-col gap-3 mb-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">{exp.role}</h3>
                    <div className="text-base sm:text-lg text-blue-600 dark:text-blue-400 font-semibold">{exp.company}</div>
                    <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{exp.location} • {exp.period}</div>
                  </div>
                  <div className="bg-teal-50 dark:bg-teal-900/20 px-4 py-2 rounded-xl border-2 border-teal-200 dark:border-teal-800 w-fit">
                    <div className="text-xl sm:text-2xl font-bold text-teal-600 dark:text-teal-400">{exp.impact}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">{exp.metric}</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {exp.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 text-sm sm:text-base">
                      <ArrowRight className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* ═══ SOCIAL MEDIA ═══ */}
        {activeTab === 'media' && (
          <div>
            <StaggerContainer stagger={0.13}>
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 text-slate-800 dark:text-slate-100">
              <span className="text-teal-500 dark:text-teal-400">✦</span> social media
            </h1>

            <div className="bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-800 mb-6 sm:mb-8 hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video overflow-hidden">
                <img src="/images/featured.png" alt="Featured Content" className="w-full h-full object-cover" />
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">@ethanzhouwealth</h3>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-4">
                  creating educational content about investing and personal finance.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-900/20 px-3 sm:px-4 py-2 rounded-full border-2 border-teal-200 dark:border-teal-800">
                    <Eye className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                    <span className="text-teal-600 dark:text-teal-400 font-semibold text-xs sm:text-sm">10M+ total views</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 sm:px-4 py-2 rounded-full border-2 border-blue-200 dark:border-blue-800">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm">22K+ across tiktok/insta/yt</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/30 px-3 sm:px-4 py-2 rounded-full border-2 border-slate-200 dark:border-slate-700">
                    <BarChart3 className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-400 font-semibold text-xs sm:text-sm">150+ videos</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href="https://instagram.com/ethanzhouwealth" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-full font-medium shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300" data-hover>
                    <Instagram className="w-4 h-4" />
                    follow on instagram
                  </a>
                  <a href="https://www.youtube.com/@Ethanzhouwealth" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300" data-hover>
                    <Youtube className="w-4 h-4" />
                    subscribe on youtube
                  </a>
                </div>
              </div>
            </div>

            {/* Brands */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-md border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 sm:mb-6 flex items-center gap-2">
                <span className="text-teal-500 dark:text-teal-400">✦</span> brands i've worked with
              </h2>
              <div className="flex justify-center items-center gap-6 flex-wrap">
                <a href="https://turbo.ai" target="_blank" rel="noopener noreferrer" className="rounded-2xl overflow-hidden w-32 h-32 hover:scale-105 transition-all duration-300 hover:shadow-lg" data-hover>
                  <img src="/images/turbo-logo.png" alt="Turbo" className="w-full h-full object-cover" />
                </a>
              </div>
              <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                interested in partnering? <a href="mailto:info@ethanzhou.ca" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold" data-hover>let's chat!</a>
              </div>
            </div>
            </StaggerContainer>
          </div>
        )}

        {/* ═══ FOOTER ═══ */}
        <footer className="mt-8 md:mt-6 text-center">
          <div className="flex justify-center gap-4 mb-4">
            <a href="mailto:info@ethanzhou.ca" className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors" data-hover>
              <Mail className="w-5 h-5" />
            </a>
            <a href="https://instagram.com/ethanzhouwealth" target="_blank" rel="noopener noreferrer" className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors" data-hover>
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://www.youtube.com/@Ethanzhouwealth" target="_blank" rel="noopener noreferrer" className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors" data-hover>
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/ethan-zhou-832565315/" target="_blank" rel="noopener noreferrer" className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors" data-hover>
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          <div className="text-sm text-slate-400 dark:text-slate-600">© 2026 ethan zhou</div>
        </footer>
      </header>
      </div>
    </div>
    </div>
  );
};

export default Portfolio;