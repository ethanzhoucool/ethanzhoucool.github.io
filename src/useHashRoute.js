import { useCallback, useEffect, useState } from 'react';

/*
 * Tabs used to be plain useState, so every section lived at the same URL:
 * no deep links, no back button, nothing for search engines to index.
 *
 * Hash routing (rather than the History API) because this deploys to GitHub
 * Pages, which has no server-side rewrite to fall back on.
 */

export const ROUTES = ['home', 'work', 'about', 'content'];
const DEFAULT_ROUTE = 'home';

/* Set at module scope, not in an effect: by the time an effect runs the
   browser has already restored the previous scroll offset, which on a
   scroll-driven page drops you mid-animation with the hero gone. */
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

/* `behavior: 'auto'` means "use the CSS value", and this site sets
   `scroll-behavior: smooth` globally. That made every route change animate a
   13,000px scroll instead of jumping. 'instant' overrides the stylesheet. */
function jumpToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

function readHash() {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  return ROUTES.includes(raw) ? raw : DEFAULT_ROUTE;
}

export function useHashRoute() {
  const [route, setRoute] = useState(readHash);

  useEffect(() => {
    const onChange = () => setRoute(readHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((next) => {
    if (!ROUTES.includes(next)) return;
    const target = next === DEFAULT_ROUTE ? '#/' : `#/${next}`;
    if (window.location.hash === target) {
      // Same route clicked again: treat it as "take me back to the top".
      jumpToTop();
      return;
    }
    window.location.hash = target;
  }, []);

  /* Land at the top of each section rather than mid-scroll from the last one. */
  useEffect(() => {
    jumpToTop();
  }, [route]);

  /* Keep the tab title honest so history entries are distinguishable. */
  useEffect(() => {
    const titles = {
      home: 'Ethan Zhou',
      work: 'Work | Ethan Zhou',
      about: 'Asymmetric risk | Ethan Zhou',
      content: 'Content | Ethan Zhou',
    };
    document.title = titles[route] || 'Ethan Zhou';
  }, [route]);

  return [route, navigate];
}
