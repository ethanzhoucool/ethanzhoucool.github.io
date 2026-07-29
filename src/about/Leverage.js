import { useEffect, useRef, useCallback } from 'react';
import { motion, useTransform, useInView, useSpring, useMotionValue } from 'framer-motion';
import { useNarrativeProgress } from './primitives';

/* ─── "Leverage" section — interactive SVG lever mechanism ─── */
const LeverageSection = () => {
  const ref = useRef(null);
  const svgRef = useRef(null);
  const scrollYProgress = useNarrativeProgress({
    target: ref,
    offset: ['start start', 'end start'],
  }, 0.7);
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

export { LeverageSection };
