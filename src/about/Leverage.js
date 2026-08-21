import { useCallback, useRef, useState } from 'react';
import { motion, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useNarrativeProgress } from './primitives';

/* Beam geometry, in viewBox units. The fulcrum sits off-centre on purpose:
   the effort arm is 85 long and the result arm is 190, so anything you do to
   the short end comes out the far end multiplied by 2.24. */
const EFFORT_ARM = 85;
const RESULT_ARM = 190;
const RATIO = RESULT_ARM / EFFORT_ARM;
const MAX_SIN = 0.4;

/* ─── "Leverage" section — interactive SVG lever mechanism ─── */
const LeverageSection = () => {
  const ref = useRef(null);
  const svgRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);
  const [travel, setTravel] = useState({ effort: 0, result: 0 });
  const [focused, setFocused] = useState(false);
  const scrollYProgress = useNarrativeProgress({
    target: ref,
    offset: ['start start', 'end start'],
  }, 0.7);

  /* Section entrance */
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);
  const sectionY = useTransform(scrollYProgress, [0, 0.12], [40, 0]);

  /* "leverage." text — blur-to-sharp */
  const wordOpacity = useTransform(scrollYProgress, [0.08, 0.22], [0, 1]);
  const wordBlur = useTransform(scrollYProgress, [0.08, 0.22], [12, 0]);
  const wordFilter = useTransform(wordBlur, (v) => `blur(${v}px)`);

  /* Beam rotation — scroll sets the resting tilt, dragging overrides it.
     The lever used to lean toward wherever the mouse happened to be, which
     is not leverage, it is a hover effect. Now you grab the short arm and
     push, and the long arm answers 2.24 times further. */
  const scrollTilt = useTransform(scrollYProgress, [0.2, 0.65], [0, -14]);
  const dragTilt = useMotionValue(0);
  const smoothDrag = useSpring(dragTilt, { stiffness: 220, damping: 26 });
  const beamAngle = useTransform([scrollTilt, smoothDrag], ([s, d]) => s + d);
  const smoothBeam = useSpring(beamAngle, { stiffness: 120, damping: 20 });

  /* Result glow intensifies as beam tips */
  const resultGlow = useTransform(scrollYProgress, [0.45, 0.65], [0, 0.5]);

  /* Labels + SVG entrance */
  const labelOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const svgOpacity = useTransform(scrollYProgress, [0.14, 0.28], [0, 1]);
  const svgY = useTransform(scrollYProgress, [0.14, 0.28], [20, 0]);

  /* Pointer position -> beam angle. Vertical only: the short arm follows
     your finger, and the geometry decides what the long arm does. */
  const applyPointer = useCallback(
    (clientY) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      /* viewBox is 400x100, so one viewBox unit is rect.width / 400 px. */
      const unit = rect.width / 400;
      const yInBox = (clientY - rect.top) / unit;
      const sin = Math.max(-MAX_SIN, Math.min(MAX_SIN, -(yInBox - 18) / EFFORT_ARM));
      const deg = (Math.asin(sin) * 180) / Math.PI;
      dragTilt.set(deg - scrollTilt.get());
      setTravel({
        effort: Math.round(Math.abs(EFFORT_ARM * sin)),
        result: Math.round(Math.abs(RESULT_ARM * sin)),
      });
    },
    [dragTilt, scrollTilt]
  );

  const onPointerDown = useCallback(
    (e) => {
      e.currentTarget.setPointerCapture?.(e.pointerId);
      setDragging(true);
      setTouched(true);
      applyPointer(e.clientY);
    },
    [applyPointer]
  );

  const onPointerMove = useCallback(
    (e) => {
      if (!dragging) return;
      applyPointer(e.clientY);
    },
    [dragging, applyPointer]
  );

  const onPointerUp = useCallback(() => setDragging(false), []);

  /* Keyboard: arrows nudge the short arm, so this works without a pointer. */
  const onKeyDown = useCallback(
    (e) => {
      const step = e.key === 'ArrowUp' ? 4 : e.key === 'ArrowDown' ? -4 : 0;
      if (!step) return;
      e.preventDefault();
      setTouched(true);
      const nextDeg = Math.max(-23, Math.min(23, dragTilt.get() + step));
      dragTilt.set(nextDeg);
      const sin = Math.sin((nextDeg * Math.PI) / 180);
      setTravel({
        effort: Math.round(Math.abs(EFFORT_ARM * sin)),
        result: Math.round(Math.abs(RESULT_ARM * sin)),
      });
    },
    [dragTilt]
  );

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
              className={`w-full touch-none overflow-visible outline-none ${
                dragging ? 'cursor-grabbing' : 'cursor-grab'
              }`}
              role="slider"
              tabIndex={0}
              aria-label="Lever. Drag or use arrow keys to push the short arm; the long arm travels 2.2 times further."
              aria-valuemin={-23}
              aria-valuemax={23}
              aria-valuenow={Math.round(travel.effort)}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onKeyDown={onKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
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

                    {/* Effort ball — small, on the short arm. This is the
                        handle: it is what you actually push. */}
                    <circle
                      cx="55"
                      cy="18"
                      r="22"
                      fill="transparent"
                      className="pointer-events-auto"
                    />
                    <circle
                      cx="55"
                      cy="18"
                      r="10"
                      className={
                        dragging
                          ? 'fill-slate-500 dark:fill-slate-300'
                          : 'fill-slate-300 dark:fill-slate-500'
                      }
                    />
                    <circle
                      cx="55"
                      cy="18"
                      r="15"
                      fill="none"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                      className={`stroke-slate-400 dark:stroke-slate-500 ${
                        touched ? 'opacity-0' : 'opacity-70'
                      }`}
                    />
                    {focused && (
                      <circle
                        cx="55"
                        cy="18"
                        r="17"
                        fill="none"
                        strokeWidth="2"
                        className="stroke-blue-500 dark:stroke-blue-400"
                      />
                    )}

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

            {/* What the geometry just did, in numbers. */}
            <div className="mt-4 flex items-center justify-center gap-5 font-mono text-[11px] text-slate-400 dark:text-slate-500">
              {touched ? (
                <>
                  <span className="tabular-nums">effort {travel.effort}</span>
                  <span className="text-slate-300 dark:text-slate-600">&rarr;</span>
                  <span className="tabular-nums text-blue-600 dark:text-blue-400">
                    result {travel.result}
                  </span>
                  <span className="tabular-nums">{RATIO.toFixed(1)}&times;</span>
                </>
              ) : (
                <span className="animate-pulse">drag the small end</span>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

/* ─── Final "asymmetric risks" hero moment — scroll-progress driven ─── */

export { LeverageSection };
