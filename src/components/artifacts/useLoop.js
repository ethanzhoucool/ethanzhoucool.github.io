import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

/*
 * The clock every animated artifact runs on.
 *
 * `beats` is a list of durations in ms; the hook returns which beat is
 * current and loops. It only ticks while the artifact is on screen, so a page
 * of eight looping thumbnails costs nothing for the seven you are not
 * looking at.
 *
 * Reduced motion parks on `restAt` — the beat that explains the tool on its
 * own, usually the answer — instead of on beat 0, which is usually the
 * question. Nothing here ever starts hidden: beat 0 is a complete picture, so
 * a throttled tab or a stalled timer still shows a finished artifact.
 */
export function useLoop(beats, { restAt = beats.length - 1 } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-10% 0px -10% 0px' });
  const reduced = useReducedMotion();
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (reduced || !inView) return undefined;
    const t = setTimeout(() => setBeat((b) => (b + 1) % beats.length), beats[beat]);
    return () => clearTimeout(t);
  }, [beat, beats, inView, reduced]);

  return { ref, beat: reduced ? restAt : beat, reduced: !!reduced };
}

/* One spring for the whole set, so the thumbnails move like one family. */
export const SPRING = { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 };
export const EASE = [0.16, 1, 0.3, 1];
