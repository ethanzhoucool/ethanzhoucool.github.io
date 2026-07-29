import { useRef } from 'react';
import { motion, useTransform, useSpring } from 'framer-motion';
import { useNarrativeProgress } from './primitives';

/* ─── Final "asymmetric risks" hero moment — scroll-progress driven ─── */
const FinalStatement = () => {
  const ref = useRef(null);
  const scrollYProgress = useNarrativeProgress({
    target: ref,
    offset: ['start end', 'start 0.25'],
  }, 0.8);

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

export { FinalStatement };
