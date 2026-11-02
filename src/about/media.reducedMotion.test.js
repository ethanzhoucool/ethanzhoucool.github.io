import { render, act } from '@testing-library/react';

/*
 * Its own file for the same reason as src/reducedMotion.test.js: framer-motion
 * caches the reduced-motion preference in a module-level singleton the first
 * time anything reads it, so matchMedia has to be stubbed before the component
 * (and with it framer-motion) is first required.
 */
test('under reduced motion the hobby clip shows its poster and does not autoplay', () => {
  window.matchMedia = (q) => ({
    matches: /prefers-reduced-motion/.test(q),
    media: q,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => false,
  });

  const observers = [];
  window.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
      this.targets = new Set();
      observers.push(this);
    }
    observe(el) {
      this.targets.add(el);
    }
    unobserve(el) {
      this.targets.delete(el);
    }
    disconnect() {
      this.targets.clear();
    }
    takeRecords() {
      return [];
    }
  };
  global.IntersectionObserver = window.IntersectionObserver;

  // eslint-disable-next-line global-require
  const { HobbiesSection } = require('./Personal');
  const { container } = render(<HobbiesSection />);

  act(() => {
    for (const o of [...observers]) {
      const entries = [...o.targets].map((target) => ({ target, isIntersecting: true }));
      if (entries.length) o.callback(entries, o);
    }
  });

  const video = container.querySelector('video');
  expect(video).toHaveAttribute('poster', '/images/jiujitsu-poster.jpg');
  expect(video).not.toHaveAttribute('autoplay');
  expect(video).toHaveAttribute('preload', 'none');
});
