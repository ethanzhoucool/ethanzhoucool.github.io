import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';

/* ─── Reduced motion for the scroll narrative ─────────────────────
   The @media (prefers-reduced-motion) block in index.css cannot reach any of
   this. It zeroes CSS animation and transition durations, but every section
   below drives transform and opacity by writing inline styles from a scroll
   position, which is not a CSS transition. So the media query never applied
   and the whole 20-screen kinetic narrative still played for people who had
   explicitly asked it not to.

   Rather than gate ~40 individual style bindings, this freezes the input.
   Each section passes the progress value at which its content is fully
   revealed, so under reduced motion everything renders at its end state:
   readable, still, and in the right place. Hooks run unconditionally either
   way, so the rules of hooks are respected.
   ────────────────────────────────────────────────────────────── */
function useNarrativeProgress(options, revealedAt = 0.6) {
  const { scrollYProgress } = useScroll(options);
  const reduce = useReducedMotion();
  const frozen = useMotionValue(revealedAt);
  return reduce ? frozen : scrollYProgress;
}

/* ─── Scroll-reveal section wrapper — scroll-progress driven ─── */
const ScrollSection = ({ children, className = '', height = 'min-h-[70vh]', id }) => {
  const ref = useRef(null);
  const scrollYProgress = useNarrativeProgress({
    target: ref,
    offset: ['start end', 'start 0.35'],
  }, 1.0);
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

/* ─── Fade-in wrapper — scroll-progress driven ─── */
const FadeInBlock = ({ children, className = '' }) => {
  const ref = useRef(null);
  const scrollYProgress = useNarrativeProgress({
    target: ref,
    offset: ['start end', 'start 0.6'],
  }, 1.0);
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

/* ─── Scroll-driven ambient atmosphere for about page ─── */
const AboutAtmosphere = () => {
  const scrollYProgress = useNarrativeProgress(undefined, 0.5);
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


export { useNarrativeProgress, ScrollSection, FadeInBlock, AboutAtmosphere };
