import { render, screen, waitFor } from '@testing-library/react';

/*
 * Lives in its own file on purpose.
 *
 * framer-motion resolves the reduced-motion preference once, into a module
 * level singleton, the first time anything mounts. Overriding matchMedia
 * inside a test that runs after other renders is therefore too late: the
 * value is already cached. Jest gives each test file a fresh module registry,
 * so stubbing matchMedia here, before App is required, is the only way to
 * exercise this path honestly.
 */
test('reduced motion reveals the narrative instead of hiding it', async () => {
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

  // eslint-disable-next-line global-require
  const App = require('./App').default;

  window.location.hash = '#/about';
  const { container } = render(<App />);
  await screen.findByText(/my philosophy/i);

  /* Every scroll section starts at opacity 0 and is revealed by scrolling.
     Freezing the progress input has to land them at their revealed state,
     otherwise a reduced-motion visitor gets a blank page rather than a calm
     one. Before this fix, 11 of 13 sections stayed hidden. */
  await waitFor(() => {
    const hidden = [...container.querySelectorAll('[style*="opacity"]')].filter((el) => {
      const o = parseFloat(el.style.opacity);
      return !Number.isNaN(o) && o < 0.05 && el.textContent.trim().length > 0;
    });
    expect(hidden.map((el) => el.textContent.trim().slice(0, 40))).toEqual([]);
  });
});
