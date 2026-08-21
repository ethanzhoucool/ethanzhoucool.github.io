import { render, screen } from '@testing-library/react';
import App from './App';

/*
 * The regression this exists for: every block on the home page mounted at
 * opacity 0 and waited for framer-motion to animate it up, so the live site
 * measured seven content blocks at opacity 0 seconds after load. rAF is
 * throttled in an unfocused tab, so a background tab or a slow connection got
 * a blank page. Entrances are CSS now, and nothing may ship an inline opacity.
 */
test('no content on the home page mounts invisible', () => {
  window.location.hash = '';
  const { container } = render(<App />);

  const invisible = [...container.querySelectorAll('[style*="opacity"]')]
    .filter((el) => {
      const o = parseFloat(el.style.opacity);
      return !Number.isNaN(o) && o < 0.95 && el.textContent.trim().length > 0;
    })
    .map((el) => el.textContent.trim().slice(0, 40));

  expect(invisible).toEqual([]);
});

test('the hero and both tracks are readable on the first render', () => {
  window.location.hash = '';
  render(<App />);
  expect(screen.getByRole('heading', { name: /hi, i.m ethan/i })).toBeVisible();
  expect(screen.getByText(/i build developer tools for mobile teams/i)).toBeVisible();
  /* Both track cards, by their headings rather than their prose — the hero
     paragraph and the first card share a phrase. */
  expect(
    screen.getByRole('heading', { name: /developer tools for mobile teams/i })
  ).toBeVisible();
  expect(
    screen.getByRole('heading', { name: /short finance videos/i })
  ).toBeVisible();
});
