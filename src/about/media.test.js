import { render, screen, act } from '@testing-library/react';
import { HobbiesSection } from './Personal';

/*
 * The hobbies grid sits at the very end of a ~17,000px page, and the jiu jitsu
 * clip in it is the heaviest asset on the site. These pin down that nothing
 * down there is fetched until the reader is nearly there.
 *
 * setupTests installs an IntersectionObserver that never fires. This file
 * swaps in one the test can drive, so "scrolled near" can be simulated.
 */

let observers = [];

class ControllableObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
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
}

function scrollEverythingIntoRange() {
  act(() => {
    for (const o of [...observers]) {
      const entries = [...o.targets].map((target) => ({
        target,
        isIntersecting: true,
        intersectionRatio: 1,
      }));
      if (entries.length) o.callback(entries, o);
    }
  });
}

const original = window.IntersectionObserver;

beforeEach(() => {
  observers = [];
  window.IntersectionObserver = ControllableObserver;
  global.IntersectionObserver = ControllableObserver;
});

afterEach(() => {
  window.IntersectionObserver = original;
  global.IntersectionObserver = original;
});

function hobbyVideo(container) {
  const videos = container.querySelectorAll('video');
  expect(videos).toHaveLength(1);
  return videos[0];
}

test('the hobby clip requests nothing, poster included, until it is near the viewport', () => {
  const { container } = render(<HobbiesSection />);
  const video = hobbyVideo(container);

  expect(video).not.toHaveAttribute('src');
  expect(video).not.toHaveAttribute('poster');
  expect(video).not.toHaveAttribute('autoplay');
  expect(video).toHaveAttribute('preload', 'none');
});

test('once near, the hobby clip gets its source and plays', () => {
  const { container } = render(<HobbiesSection />);
  scrollEverythingIntoRange();
  const video = hobbyVideo(container);

  expect(video).toHaveAttribute('src', '/images/jiujitsu.mp4');
  expect(video).toHaveAttribute('poster', '/images/jiujitsu-poster.jpg');
  expect(video).toHaveAttribute('autoplay');
  expect(video.muted).toBe(true);
});

test('the clip is watched with a lead, so it is ready before it scrolls in', () => {
  render(<HobbiesSection />);
  const margins = observers.map((o) => o.options && o.options.rootMargin);
  expect(margins).toContain('800px 0px');
});

test('hobby photos are lazy-loaded', () => {
  render(<HobbiesSection />);
  for (const label of ['badminton', 'hockey', 'investing']) {
    const img = screen.getByRole('img', { name: label });
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
  }
});
