import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './ui';

/* ─── Pointer-following backdrop ──────────────────────────────────
   The soft radial wash behind every page that drifts toward the pointer.

   It was a framer-motion useSpring feeding a useMotionTemplate, which was
   the only reason the app shell imported framer-motion at all. That put
   ~40 kB of gzipped animation library on the critical path of the home
   page, where nothing else uses it. This is the same spring, integrated
   by hand: stiffness 60, damping 20, mass 1, the rest thresholds
   useSpring applies, and the 40ms frame-delta cap framer's frame loop
   uses. It writes two custom properties; index.css owns the gradient.

   Like the spring it replaces, it only runs while it is moving. Under
   reduced motion it stays centred, like every other pointer flourish in
   components/ui.js: the wash is still there, it just does not chase you.
   ────────────────────────────────────────────────────────────── */

const STIFFNESS = 60;
const DAMPING = 20;
const MASS = 1;
const REST_DELTA = 0.001;
const REST_SPEED = 0.01;
const MAX_FRAME_MS = 40;

/* One semi-implicit Euler step of a damped spring, in place. */
function stepAxis(state, target, dt) {
  const force = -STIFFNESS * (state.p - target) - DAMPING * state.v;
  state.v += (force / MASS) * dt;
  state.p += state.v * dt;
}

function isResting(state, target) {
  return Math.abs(target - state.p) <= REST_DELTA && Math.abs(state.v) <= REST_SPEED;
}

export default function Backdrop() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const target = { x: 0.5, y: 0.5 };
    const x = { p: 0.5, v: 0 };
    const y = { p: 0.5, v: 0 };
    let raf = null;
    let last = 0;

    const write = () => {
      el.style.setProperty('--backdrop-x', `${x.p * 100}%`);
      el.style.setProperty('--backdrop-y', `${y.p * 100}%`);
    };

    const tick = (now) => {
      const elapsed = Math.min(Math.max(now - last, 1), MAX_FRAME_MS);
      last = now;
      /* 1ms substeps keep the integration indistinguishable from the
         closed-form spring at any frame rate. */
      for (let t = 0; t < elapsed; t += 1) {
        const dt = Math.min(1, elapsed - t) / 1000;
        stepAxis(x, target.x, dt);
        stepAxis(y, target.y, dt);
      }
      const resting = isResting(x, target.x) && isResting(y, target.y);
      if (resting) {
        x.p = target.x;
        y.p = target.y;
        x.v = 0;
        y.v = 0;
      }
      write();
      raf = resting ? null : requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      target.x = e.clientX / window.innerWidth;
      target.y = e.clientY / window.innerHeight;
      if (raf === null) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-backdrop pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
