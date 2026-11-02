import { render, fireEvent } from '@testing-library/react';
import { spring } from 'framer-motion';
import Backdrop from './Backdrop';

/*
 * The backdrop used to be a framer-motion useSpring. It is hand-integrated
 * now so the app shell does not need framer-motion at all, and these hold it
 * to the curve it replaced: framer's own spring generator, same stiffness,
 * damping and rest thresholds, is the reference.
 */

const FRAME = 1000 / 60;
let queue;
let now;
let nextId;
const originals = {
  raf: window.requestAnimationFrame,
  caf: window.cancelAnimationFrame,
  now: performance.now,
};

beforeEach(() => {
  queue = new Map();
  now = 1000;
  nextId = 1;
  window.requestAnimationFrame = (cb) => {
    const id = nextId;
    nextId += 1;
    queue.set(id, cb);
    return id;
  };
  window.cancelAnimationFrame = (id) => queue.delete(id);
  performance.now = () => now;
});

afterEach(() => {
  window.requestAnimationFrame = originals.raf;
  window.cancelAnimationFrame = originals.caf;
  performance.now = originals.now;
});

function frame() {
  now += FRAME;
  const due = [...queue.values()];
  queue.clear();
  due.forEach((cb) => cb(now));
}

const read = (el, axis) => parseFloat(el.style.getPropertyValue(`--backdrop-${axis}`)) / 100;

function renderBackdrop() {
  const { container, unmount } = render(<Backdrop />);
  return { el: container.firstChild, unmount };
}

test('is idle until the pointer moves', () => {
  const { el } = renderBackdrop();
  expect(queue.size).toBe(0);
  /* No inline position: index.css centres it at 50% 50%. */
  expect(el.style.getPropertyValue('--backdrop-x')).toBe('');
  expect(el).toHaveAttribute('aria-hidden', 'true');
});

test('follows the pointer along the same spring framer-motion drew', () => {
  const { el } = renderBackdrop();
  const target = { x: 0.9, y: 0.2 };
  fireEvent.mouseMove(window, {
    clientX: target.x * window.innerWidth,
    clientY: target.y * window.innerHeight,
  });

  const options = { stiffness: 60, damping: 20, restDelta: 0.001, restSpeed: 0.01 };
  const refX = spring({ keyframes: [0.5, target.x], ...options });
  const refY = spring({ keyframes: [0.5, target.y], ...options });

  let worst = 0;
  for (let i = 1; i <= 90; i += 1) {
    frame();
    const t = i * FRAME;
    worst = Math.max(
      worst,
      Math.abs(read(el, 'x') - refX.next(t).value),
      Math.abs(read(el, 'y') - refY.next(t).value)
    );
  }
  /* Within a tenth of a percent of the viewport on every frame. */
  expect(worst).toBeLessThan(0.001);
});

test('stops scheduling frames once it comes to rest, exactly on target', () => {
  const { el } = renderBackdrop();
  fireEvent.mouseMove(window, {
    clientX: 0.25 * window.innerWidth,
    clientY: 0.75 * window.innerHeight,
  });
  for (let i = 0; i < 400 && queue.size; i += 1) frame();

  expect(queue.size).toBe(0);
  expect(read(el, 'x')).toBe(0.25);
  expect(read(el, 'y')).toBe(0.75);
});

test('unmounting cancels the pending frame and stops listening', () => {
  const { el, unmount } = renderBackdrop();
  fireEvent.mouseMove(window, { clientX: 10, clientY: 10 });
  expect(queue.size).toBe(1);

  unmount();
  expect(queue.size).toBe(0);

  fireEvent.mouseMove(window, { clientX: 500, clientY: 500 });
  expect(queue.size).toBe(0);
  expect(el.style.getPropertyValue('--backdrop-x')).toBe('');
});

test('holds still, centred, under reduced motion', () => {
  const original = window.matchMedia;
  window.matchMedia = (q) => ({
    matches: /prefers-reduced-motion/.test(q),
    media: q,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
  });
  try {
    const { el } = renderBackdrop();
    fireEvent.mouseMove(window, { clientX: 10, clientY: 10 });
    expect(queue.size).toBe(0);
    for (let i = 0; i < 30; i += 1) frame();
    /* Left to the stylesheet's 50% 50%. */
    expect(el.style.getPropertyValue('--backdrop-x')).toBe('');
    expect(el.style.getPropertyValue('--backdrop-y')).toBe('');
  } finally {
    window.matchMedia = original;
  }
});
