import { render, screen, within, waitFor, fireEvent } from '@testing-library/react';
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
  expect(screen.getByText(/United Lift Technologies/i)).toBeInTheDocument();
  /* The current job was missing from the page entirely. */
  expect(screen.getByText(/^Revyl$/)).toBeInTheDocument();
  expect(screen.getByText(/Growth Engineer/i)).toBeInTheDocument();
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

/* ── /about ────────────────────────────────────────────────────────
   The largest and most fragile route, and until now the only one with no
   coverage at all. It is lazily loaded, so these await the chunk.
   ────────────────────────────────────────────────────────────────── */

async function renderAbout() {
  window.location.hash = '#/about';
  const utils = render(<App />);
  await screen.findByText(/my philosophy/i);
  return utils;
}

test('about renders the whole narrative, in order', async () => {
  const { container } = await renderAbout();

  /* Split per letter by UncomfortableLetter, so no single node holds it. */
  expect(container.textContent).toMatch(/uncomfortable/i);

  for (const beat of [
    /my philosophy/i,
    /obsessed/i,
    /concept we use in Judo/i,
    /leverage/i,
    /maximize/i,
    /asymmetry matters/i,
    /Send an email to someone you admire/i,
    /opportunities are/i,
    /rather take/i,
    /about me/i,
  ]) {
    expect(screen.getAllByText(beat).length).toBeGreaterThan(0);
  }
});

test('about copy has no em-dashes', async () => {
  const { container } = await renderAbout();
  expect(container.textContent).not.toMatch(/[—–]/);
});

test('the payoff curve is described for screen readers', async () => {
  await renderAbout();
  expect(screen.getByRole('img', { name: /payoff curve/i })).toBeInTheDocument();
});

test('hobby cards are buttons, not click-only divs', async () => {
  await renderAbout();
  for (const label of ['jiu jitsu', 'badminton', 'hockey', 'investing']) {
    const btn = screen.getByRole('button', { name: new RegExp(label, 'i') });
    expect(btn.tagName).toBe('BUTTON');
  }
});

test('the hobby dialog is reachable and closable by keyboard', async () => {
  await renderAbout();

  fireEvent.click(screen.getByRole('button', { name: /badminton/i }));

  const dialog = await screen.findByRole('dialog');
  expect(dialog).toHaveAttribute('aria-modal', 'true');
  expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();

  fireEvent.keyDown(document, { key: 'Escape' });
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
});
