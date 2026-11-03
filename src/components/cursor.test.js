import { render, fireEvent } from '@testing-library/react';
import { CustomCursor } from './ui';

/*
 * The custom cursor's frame loop used to run at 60fps for as long as the page
 * was open, including while the pointer sat perfectly still. These drive the
 * loop one frame at a time to pin down that it only runs while there is
 * something to animate, and that it still notices when the page moves under a
 * still pointer.
 */

let frames;
let nextId;
const originalRaf = window.requestAnimationFrame;
const originalCaf = window.cancelAnimationFrame;
const originalMatchMedia = window.matchMedia;
const originalElementFromPoint = document.elementFromPoint;

function stubMedia({ fine = true, reduce = false } = {}) {
  window.matchMedia = (q) => ({
    matches: q.includes('pointer: fine') ? fine : q.includes('reduced-motion') ? reduce : false,
    media: q,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
  });
}

function step(n = 1) {
  for (let i = 0; i < n; i += 1) {
    const due = [...frames.values()];
    frames.clear();
    due.forEach((cb) => cb(0));
  }
}

let underPointer;

beforeEach(() => {
  frames = new Map();
  nextId = 1;
  window.requestAnimationFrame = (cb) => {
    const id = nextId;
    nextId += 1;
    frames.set(id, cb);
    return id;
  };
  window.cancelAnimationFrame = (id) => frames.delete(id);

  underPointer = document.body;
  document.elementFromPoint = () => underPointer;
  stubMedia();
});

afterEach(() => {
  window.requestAnimationFrame = originalRaf;
  window.cancelAnimationFrame = originalCaf;
  window.matchMedia = originalMatchMedia;
  document.elementFromPoint = originalElementFromPoint;
});

function renderCursor() {
  const utils = render(<CustomCursor />);
  const [dot, ring] = utils.container.children;
  return { ...utils, dot, ring };
}

test('no frame loop runs before the pointer has moved', () => {
  renderCursor();
  expect(document.documentElement).toHaveClass('cursor-custom');
  expect(frames.size).toBe(0);
});

test('the loop runs while the ring trails, then parks once the pointer is still', () => {
  const { dot, ring } = renderCursor();

  fireEvent.mouseMove(window, { clientX: 300, clientY: 200 });
  expect(frames.size).toBe(1);

  step(5);
  /* Still trailing, so still scheduled. */
  expect(frames.size).toBe(1);
  expect(dot.style.transform).toBe('translate3d(300px, 200px, 0)');
  expect(ring.style.transform).not.toBe('translate3d(300px, 200px, 0)');

  step(200);
  expect(frames.size).toBe(0);
  /* Parked exactly on the dot, not a fraction of a pixel short. */
  expect(ring.style.transform).toBe('translate3d(300px, 200px, 0)');
  expect(dot.style.opacity).toBe('1');
});

test('moving again after parking wakes it', () => {
  renderCursor();
  fireEvent.mouseMove(window, { clientX: 10, clientY: 10 });
  step(200);
  expect(frames.size).toBe(0);

  fireEvent.mouseMove(window, { clientX: 50, clientY: 60 });
  expect(frames.size).toBe(1);
});

test('scrolling under a still pointer still updates the hover state', () => {
  const { dot, ring } = renderCursor();
  const button = document.createElement('button');
  document.body.appendChild(button);

  underPointer = button;
  fireEvent.mouseMove(window, { clientX: 120, clientY: 80 });
  step(200);
  expect(frames.size).toBe(0);
  expect(dot).toHaveClass('hovering');
  expect(ring).toHaveClass('hovering');

  /* The page scrolls; the pointer does not. Now it is over plain text. */
  underPointer = document.body;
  fireEvent.scroll(document);
  expect(frames.size).toBe(1);
  step(200);
  expect(dot).not.toHaveClass('hovering');
  expect(ring).not.toHaveClass('hovering');
  expect(frames.size).toBe(0);

  button.remove();
});

test('a click wakes it too, since it can swap the page under the pointer', () => {
  const { dot } = renderCursor();
  underPointer = document.body;
  fireEvent.mouseMove(window, { clientX: 120, clientY: 80 });
  step(200);

  const link = document.createElement('a');
  link.href = '#/work';
  document.body.appendChild(link);
  underPointer = link;
  fireEvent.click(window);
  step(200);
  expect(dot).toHaveClass('hovering');
  expect(frames.size).toBe(0);

  link.remove();
});

test('leaving the window hides it and then parks', () => {
  const { dot, ring } = renderCursor();
  fireEvent.mouseMove(window, { clientX: 40, clientY: 40 });
  step(200);

  fireEvent.mouseLeave(document);
  step(200);
  expect(dot.style.opacity).toBe('0');
  expect(ring.style.opacity).toBe('0');
  expect(frames.size).toBe(0);
});

test('unmounting cancels a pending frame and restores the native cursor', () => {
  const { unmount } = renderCursor();
  fireEvent.mouseMove(window, { clientX: 40, clientY: 40 });
  expect(frames.size).toBe(1);

  unmount();
  expect(frames.size).toBe(0);
  expect(document.documentElement).not.toHaveClass('cursor-custom');
});

test('touch and reduced-motion visitors get the native cursor and no loop', () => {
  for (const media of [{ fine: false }, { reduce: true }]) {
    stubMedia(media);
    const { unmount } = renderCursor();
    fireEvent.mouseMove(window, { clientX: 40, clientY: 40 });
    expect(frames.size).toBe(0);
    expect(document.documentElement).not.toHaveClass('cursor-custom');
    unmount();
  }
});
