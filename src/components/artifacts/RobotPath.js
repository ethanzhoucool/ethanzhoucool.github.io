import React, { useEffect, useRef } from 'react';
import { motion, animate, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';

/*
 * The autonomous robot, seen from above: gps waypoints it is driving between,
 * a lidar sweep, and the obstacle that makes it steer. The PID line is the
 * corrected path, not the planned one — which is the whole point of the
 * controller.
 *
 * In motion, the robot drives it: the corrected path draws in behind it and
 * the lidar cone rides along. At rest (and for reduced motion) the path is
 * complete, so the figure never depends on the animation to make sense.
 */
const PATH = 'M 30 112 C 96 96, 118 104, 140 96 S 168 42, 200 44 L 270 38';

export default function RobotPath() {
  const ref = useRef(null);
  const pathRef = useRef(null);
  const inView = useInView(ref, { margin: '-10% 0px -10% 0px' });
  const reduced = useReducedMotion();
  const progress = useMotionValue(1);

  const point = (t) => {
    const el = pathRef.current;
    if (!el || typeof el.getTotalLength !== 'function') return { x: 270, y: 38 };
    return el.getPointAtLength(el.getTotalLength() * t);
  };
  const rx = useTransform(progress, (t) => point(t).x);
  const ry = useTransform(progress, (t) => point(t).y);
  /* Heading, from a point a little further along, so the cone looks ahead. */
  const heading = useTransform(progress, (t) => {
    const a = point(t);
    const b = point(Math.min(1, t + 0.02));
    return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  });

  useEffect(() => {
    if (reduced || !inView) return undefined;
    const controls = animate(progress, [0, 1], {
      duration: 4.2,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 1.2,
    });
    return () => {
      controls.stop();
      progress.set(1);
    };
  }, [inView, reduced, progress]);

  return (
    <figure ref={ref} className="m-0">
      <svg
        viewBox="0 0 300 150"
        className="w-full"
        role="img"
        aria-label="Top-down view: GPS waypoints, a LiDAR sweep detecting an obstacle, and the corrected path around it."
      >
        {/* Field grid */}
        <g className="text-slate-200 dark:text-slate-700">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={`v${i}`}
              x1={i * 60}
              y1="0"
              x2={i * 60}
              y2="150"
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <line
              key={`h${i}`}
              x1="0"
              y1={i * 50}
              x2="300"
              y2={i * 50}
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </g>

        {/* Planned straight line between waypoints */}
        <line
          x1="30"
          y1="112"
          x2="270"
          y2="38"
          className="text-slate-300 dark:text-slate-600"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 4"
        />

        {/* Obstacle */}
        <rect
          x="146"
          y="58"
          width="26"
          height="26"
          rx="2"
          className="text-rose-500"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="currentColor"
          strokeWidth="1"
        />

        {/* LiDAR sweep, riding on the robot and looking where it heads */}
        <motion.path
          d="M 0 0 L 52 -22 A 56 56 0 0 1 52 22 Z"
          /* Origin at the wedge's apex: x 0, and halfway down a symmetric
             bounding box is y 0. */
          style={{ x: rx, y: ry, rotate: heading, originX: 0, originY: 0.5 }}
          className="text-blue-500"
          fill="currentColor"
          fillOpacity="0.10"
        />

        {/* Corrected path around the obstacle, drawn in as it is driven */}
        <path ref={pathRef} d={PATH} fill="none" stroke="none" />
        <motion.path
          d={PATH}
          className="text-blue-600 dark:text-blue-400"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          style={{ pathLength: progress }}
        />

        {/* Waypoints */}
        {[
          [30, 112],
          [200, 44],
          [270, 38],
        ].map(([cx, cy]) => (
          <circle
            key={`${cx}`}
            cx={cx}
            cy={cy}
            r="3.5"
            className="text-blue-600 dark:text-blue-400"
            fill="currentColor"
          />
        ))}

        {/* The robot */}
        <motion.circle
          cx={rx}
          cy={ry}
          r="5"
          className="text-slate-900 dark:text-slate-100"
          fill="currentColor"
          stroke="white"
          strokeWidth="1.5"
        />

        <text
          x="152"
          y="52"
          className="fill-rose-500"
          fontSize="8"
          fontFamily="ui-monospace, monospace"
        >
          obstacle
        </text>
        <text
          x="30"
          y="132"
          className="fill-slate-400"
          fontSize="8"
          fontFamily="ui-monospace, monospace"
        >
          gps wp 01
        </text>
        <text
          x="270"
          y="26"
          textAnchor="end"
          className="fill-slate-400"
          fontSize="8"
          fontFamily="ui-monospace, monospace"
        >
          wp 03
        </text>
      </svg>

      <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-slate-400 dark:text-slate-500">
        <span>gps waypoints</span>
        <span className="text-blue-600 dark:text-blue-400">pid-corrected path</span>
        <span className="text-rose-500">lidar stop</span>
      </figcaption>
    </figure>
  );
}
