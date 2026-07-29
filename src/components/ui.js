import React, { useEffect, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════
   Shared interactive primitives.

   All of these are pointer flourishes. Each one is now gated on
   `canHover()` so touch devices and reduced-motion users get a plain,
   working page instead of a degraded one.
   ═══════════════════════════════════════════════════════════════ */

/* matchMedia is guarded throughout: jsdom does not implement it, and these are
   progressive enhancements. If the query cannot be answered, fall back to the
   plainer behaviour rather than throwing. */
function mq(query) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(query).matches;
}

export function prefersReducedMotion() {
  return mq('(prefers-reduced-motion: reduce)');
}

export function canHover() {
  return mq('(pointer: fine)') && !prefersReducedMotion();
}

/* ─── Custom cursor ───────────────────────────────────────────────
   Kept, because it is part of the site's character. Three fixes:

   1. It now adds `.cursor-custom` to <html> itself, so `cursor: none`
      only ever applies when this component is actually alive. Before,
      `* { cursor: none }` was unconditional in CSS: if this failed to
      mount, or you were on a trackpad-less device, you had no pointer.
   2. `elementFromPoint` ran on every single frame, forcing a layout
      read at 60fps. Now sampled every 4th frame, which is far below
      the threshold where you would notice.
   3. Bails out entirely on coarse pointers and reduced motion.
   ────────────────────────────────────────────────────────────── */
export function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!canHover()) return undefined;

    const root = document.documentElement;
    root.classList.add('cursor-custom');

    const pos = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let hovering = false;
    let visible = false;
    let frame = 0;
    let raf;

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      visible = true;
    };
    const onLeave = () => {
      visible = false;
    };

    const animate = () => {
      const dot = dotRef.current;
      const rng = ringRef.current;
      if (dot && rng) {
        dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        dot.style.opacity = visible ? 1 : 0;

        /* Deliberate trail: the ring eases toward the dot. */
        ring.x += (pos.x - ring.x) * 0.18;
        ring.y += (pos.y - ring.y) * 0.18;
        rng.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
        rng.style.opacity = visible ? 1 : 0;

        if (frame % 4 === 0) {
          const el = document.elementFromPoint(pos.x, pos.y);
          const next = !!(
            el && el.closest('a, button, [role="button"], [data-hover]')
          );
          if (next !== hovering) {
            hovering = next;
            dot.className = `custom-cursor${hovering ? ' hovering' : ''}`;
            rng.className = `cursor-ring${hovering ? ' hovering' : ''}`;
          }
        }
        frame += 1;
      }
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
      root.classList.remove('cursor-custom');
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor" style={{ opacity: 0 }} aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" style={{ opacity: 0 }} aria-hidden="true" />
    </>
  );
}

/* ─── Magnetic button ─────────────────────────────────────────── */
export function MagneticButton({ children, strength = 0.22 }) {
  const ref = useRef(null);

  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el || !canHover()) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = 'translate(0, 0)';
  };

  return (
    <div
      ref={ref}
      className="magnetic-btn inline-block"
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      onBlur={reset}
    >
      {children}
    </div>
  );
}

/* ─── Proximity text — letters lean toward the cursor ─────────────
   Rewritten to measure letter centres once (and on resize) instead of
   calling getBoundingClientRect() for every letter on every frame.
   On the old hero that was 20 layout reads per frame, forever.
   ────────────────────────────────────────────────────────────── */
export function ProximityText({ text, className = '' }) {
  const lettersRef = useRef([]);

  const hostRef = useRef(null);

  useEffect(() => {
    if (!canHover()) return undefined;

    const host = hostRef.current;
    const mouse = { x: -9999, y: -9999 };
    let centres = [];
    let raf = null;
    let onScreen = true;

    /* Measured in DOCUMENT space, once. The previous version re-measured on
       every scroll event, which meant 41 getBoundingClientRect calls (one per
       letter) per event: a forced layout each time, on a page built entirely
       around scrolling. Viewport position is now derived arithmetically from
       scrollX/scrollY instead, so scrolling costs nothing. */
    const measure = () => {
      const sx = window.scrollX;
      const sy = window.scrollY;
      centres = lettersRef.current.map((el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 + sx, y: r.top + r.height / 2 + sy };
      });
    };

    const onMove = (e) => {
      mouse.x = e.clientX + window.scrollX;
      mouse.y = e.clientY + window.scrollY;
    };

    const MAX = 120;
    const animate = () => {
      const n = lettersRef.current.length;
      for (let i = 0; i < n; i += 1) {
        const el = lettersRef.current[i];
        const c = centres[i];
        if (!el || !c) continue;
        const dx = mouse.x - c.x;
        const dy = mouse.y - c.y;
        const dist = Math.hypot(dx, dy);
        let next = '';
        if (dist < MAX && dist > 0.01) {
          const s = 1 - dist / MAX;
          next = `translate(${(dx / dist) * s * 4}px, ${(dy / dist) * s * 4}px) scale(${
            1 + s * 0.18
          })`;
        }
        /* Only touch the DOM when the value actually changes. At rest this
           loop now performs zero writes instead of 41 per frame. */
        if (el.style.transform !== next) el.style.transform = next;
      }
      raf = requestAnimationFrame(animate);
    };

    const start = () => {
      if (raf === null) raf = requestAnimationFrame(animate);
    };
    const stop = () => {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    };

    /* The hero scrolls away but used to keep animating for the life of the
       route. Pause it once it leaves the viewport. */
    const io =
      host && 'IntersectionObserver' in window
        ? new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting;
            if (onScreen) {
              measure();
              start();
            } else {
              stop();
            }
          })
        : null;
    if (io && host) io.observe(host);

    measure();
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', measure);
    if (!io) start();

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', measure);
      if (io) io.disconnect();
      stop();
    };
  }, [text]);

  return (
    <span ref={hostRef} className={className}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          ref={(el) => (lettersRef.current[i] = el)}
          className="proximity-letter"
          aria-hidden="true"
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </span>
  );
}

/* ─── Flip portrait ───────────────────────────────────────────── */
export function FlipPhoto({ className = '' }) {
  const cardRef = useRef(null);

  const onMouseMove = (e) => {
    const card = cardRef.current;
    if (!card || !canHover()) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const inner = card.querySelector('.flip-card-inner');
    if (inner) {
      inner.style.transform = `rotateY(180deg) rotateX(${y * -8}deg) rotateY(${
        x * 8
      }deg) translateZ(10px)`;
    }
  };

  const reset = () => {
    const inner = cardRef.current?.querySelector('.flip-card-inner');
    if (inner) inner.style.transform = '';
  };

  return (
    <div
      ref={cardRef}
      className={`flip-card ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      data-hover
    >
      <div className="flip-card-inner rounded-full shadow-card ring-1 ring-slate-900/5 dark:ring-slate-100/10">
        <div className="flip-card-front">
          <img
            src="/images/seriousheadshot.JPG"
            alt="Ethan Zhou"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flip-card-back">
          <img
            src="/images/headshot.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
