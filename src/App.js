import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from 'framer-motion';
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

/* ─── Obsession statement — sticky scroll-locked word reveal ─── */
const ObsessionWord = ({ word, progress, index, total }) => {
  const start = 0.15 + (index / total) * 0.55;
  const end = start + 0.55 / total;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [25, 0]);
  const blur = useTransform(progress, [start, end], [8, 0]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  // Shimmer effect for "obsessed" - scroll-driven
  const shimmerPos = useTransform(progress, [0.6, 0.85], [-200, 200]);
  const backgroundPosition = useTransform(shimmerPos, (v) => `${v}% center`);

  return (
    <motion.span
      style={{
        opacity,
        y,
        filter,
        ...(word === 'obsessed' && { backgroundPosition }),
      }}
      className={word === 'obsessed' ? 'obsession-shimmer font-semibold' : ''}
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

  const words = ["I'm", 'obsessed', 'with', 'this', 'idea.'];

  return (
    <div ref={ref} className="relative h-[325vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center px-6">
        <p className="text-2xl sm:text-3xl md:text-4xl text-slate-800 dark:text-slate-100 text-center font-medium leading-snug flex flex-wrap justify-center gap-x-[0.3em] max-w-2xl">
          {words.map((word, i) => (
            <ObsessionWord key={i} word={word} progress={scrollYProgress} index={i} total={words.length} />
          ))}
        </p>
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
    <div ref={ref} className="relative h-[375vh]">
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

  return (
    <div ref={heroRef} className="min-h-[85vh] relative overflow-hidden">
      <motion.div
        ref={contentRef}
        style={{ opacity: fadeOut, scale: scaleOut, y: yOut }}
        className="relative z-10 min-h-[85vh] flex flex-col justify-start pt-[4vh] sm:pt-[6vh] pb-8 px-8 sm:px-12 md:px-20 lg:px-28 max-w-6xl mx-auto"
      >
        {/* MY PHILOSOPHY — tiny uppercase tag */}
        <motion.p
          style={{ opacity: tagOpacity, y: tagY }}
          className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-slate-400 dark:text-slate-500 mb-6 sm:mb-8 md:mb-10 font-medium"
        >
          my philosophy
        </motion.p>

        {/* ASYMMETRIC RISK — massive bold heading */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="mb-5 sm:mb-7"
        >
          <h1 className="font-bold text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight leading-[0.9] text-slate-800 dark:text-slate-100">
            <span className="text-blue-600 dark:text-blue-400">Asymmetric</span>
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
          style={{ opacity: quoteOpacity, y: quoteY }}
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

/* ─── "Leverage" section — scroll-progress fade-in ─── */
const LeverageSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.35'],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <div ref={ref} className="min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center px-6">
      <motion.div
        style={{ opacity, y }}
        className="text-center max-w-2xl mx-auto"
      >
        <p className="text-xl sm:text-2xl md:text-3xl text-slate-600 dark:text-slate-300 leading-relaxed">
          The ultimate concept between these two ideas is
        </p>
        <p className="text-5xl sm:text-6xl md:text-8xl font-playfair font-bold text-slate-800 dark:text-slate-100 mt-3 sm:mt-4">
          leverage.
        </p>
      </motion.div>
    </div>
  );
};

/* ─── Final "asymmetric risks" hero moment — scroll-progress driven ─── */
const FinalStatement = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.35'],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);

  return (
    <div ref={ref} className="min-h-[70vh] sm:min-h-[85vh] flex items-center justify-center px-6">
      <motion.div style={{ opacity, scale }} className="text-center">
        <p className="font-playfair text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
          I'd rather take
          <br />
          <span className="text-blue-600 dark:text-blue-400">asymmetric</span> risks.
        </p>
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
  const uncomfScale = useTransform(scrollYProgress, [0.2, 0.32], [0.8, 1]);

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
    <div ref={ref} className="relative h-[425vh]">
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

        {/* "because it's uncomfortable" — big dramatic reveal */}
        <motion.div
          style={{ opacity: uncomfOpacity, scale: uncomfScale }}
          className="text-center"
        >
          <p className="text-sm sm:text-base text-slate-400 dark:text-slate-500 mb-2">but because it's</p>
          <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            uncomfortable.
          </p>
        </motion.div>

        {/* "So they choose the status quo" — faded, smaller */}
        <motion.p
          style={{ opacity: statusOpacity }}
          className="text-center text-base sm:text-lg text-slate-400 dark:text-slate-500"
        >
          So they choose the <span className="italic">status quo</span>.
        </motion.p>

        {/* Symmetric scale visual */}
        <motion.div
          style={{ opacity: scaleVisOpacity, y: scaleVisY }}
          className="pt-4 sm:pt-8"
        >
          <div className="relative flex items-center justify-center gap-4 sm:gap-6">
            {/* Left side — limited downside */}
            <motion.div
              style={{ x: leftX, opacity: leftOpacity }}
              className="flex-1 text-right"
            >
              <p className="text-sm sm:text-base uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1 font-semibold">downside</p>
              <div className="h-[2px] bg-slate-300 dark:bg-slate-600 rounded-full" />
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-2 font-semibold">limited</p>
            </motion.div>

            {/* Center pivot */}
            <motion.div
              style={{ scale: pivotScale }}
              className="flex-shrink-0"
            >
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-slate-400 dark:bg-slate-500" />
            </motion.div>

            {/* Right side — limited upside */}
            <motion.div
              style={{ x: rightX, opacity: rightOpacity }}
              className="flex-1 text-left"
            >
              <p className="text-sm sm:text-base uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1 font-semibold">upside</p>
              <div className="h-[2px] bg-slate-300 dark:bg-slate-600 rounded-full" />
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-2 font-semibold">limited</p>
            </motion.div>
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
      impact: '5M+',
      metric: 'Total Views',
      highlights: [
        'Created 150+ educational finance videos',
        'Generated 5M+ views across platforms',
        'Built audience of 20,000+ followers',
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
          <motion.div
            className="-mx-6 -mt-4"
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
            <ScrollSection height="min-h-[60vh] sm:min-h-[70vh]">
              <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed sm:leading-loose text-center">
                Every action should maximize the ratio of results to effort. It's about placing small bets where the upside is{' '}
                <strong className="text-slate-800 dark:text-slate-100 font-semibold">enormous</strong>{' '}
                and the downside is{' '}
                <strong className="text-slate-800 dark:text-slate-100 font-semibold">negligible</strong>.
              </p>
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
                    <span className="text-teal-600 dark:text-teal-400 font-semibold text-xs sm:text-sm">5M+ total views</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 sm:px-4 py-2 rounded-full border-2 border-blue-200 dark:border-blue-800">
                    <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm">20K+ across tiktok/insta/yt</span>
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