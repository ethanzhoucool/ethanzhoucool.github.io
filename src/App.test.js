import { render, screen, within } from '@testing-library/react';
import App from './App';

/*
 * Replaces the Create React App boilerplate test, which looked for a "learn
 * react" link this site has never had. It failed on every run.
 *
 * These cover the things that were actually broken and would be easy to
 * regress: the experience section no nav item reached, the single-project work
 * page, and the removed YouTube admin screenshot.
 */

beforeEach(() => {
  window.location.hash = '';
});

test('renders without crashing', () => {
  render(<App />);
  expect(screen.getAllByText(/ethan zhou/i).length).toBeGreaterThan(0);
});

test('every nav route is reachable', () => {
  render(<App />);
  const nav = screen.getByRole('navigation', { name: /primary/i });
  for (const label of ['work', 'about', 'content']) {
    expect(within(nav).getByRole('button', { name: label })).toBeInTheDocument();
  }
});

test('work page lists more than one project', () => {
  window.location.hash = '#/work';
  render(<App />);
  const repoLinks = screen
    .getAllByRole('link')
    .filter((a) => (a.getAttribute('href') || '').includes('github.com/ethanzhoucool'));
  expect(repoLinks.length).toBeGreaterThan(1);
});

test('experience is reachable, not orphaned', () => {
  window.location.hash = '#/work';
  render(<App />);
  expect(screen.getByText(/^experience$/i)).toBeInTheDocument();
  expect(screen.getByText(/United Lifts Technologies/i)).toBeInTheDocument();
});

test('the YouTube admin screenshot is gone from the content page', () => {
  window.location.hash = '#/content';
  const { container } = render(<App />);
  const srcs = [...container.querySelectorAll('img')].map((i) => i.getAttribute('src'));
  expect(srcs).not.toContain('/images/featured.png');
});

test('no em-dashes in rendered copy', () => {
  for (const hash of ['#/', '#/work', '#/content']) {
    window.location.hash = hash;
    const { container, unmount } = render(<App />);
    expect(container.textContent).not.toMatch(/[—–]/);
    unmount();
  }
});
