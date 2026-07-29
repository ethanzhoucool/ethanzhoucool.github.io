/*
 * Real projects, real links. Descriptions are rewritten from each repo's own
 * description in Ethan's lowercase voice. No invented metrics, no fake stars.
 *
 * Ordered by engineering weight, not by what is fun to look at. The games
 * (gta7-js, imposter-word) are deliberately not here: they are still on the
 * GitHub profile, but they are not what this page is arguing.
 *
 * `media` is only set where a real asset exists on disk. Everything else stays
 * typographic on purpose: a hand-drawn <div> mockup pretending to be a
 * screenshot is worse than no screenshot.
 */

export const FEATURED = {
  slug: 'atlas-dropoff',
  title: 'Atlas Drop-off',
  blurb:
    'shows you the exact screen a user quit on, with the funnel drop-off painted onto a real screenshot of it. an expo sdk that emits the events, a cli that renders the report.',
  stack: ['TypeScript', 'Expo', 'PostHog', 'CLI'],
  repo: 'https://github.com/ethanzhoucool/atlas-dropoff',
  live: null,
  /* Shown in the dark panel beside the feature copy. */
  note: ['sdk + cli + report generator', 'built on revyl atlas and posthog'],
};

export const PROJECTS = [
  {
    slug: 'redaction-checker',
    title: 'Redaction Checker',
    blurb:
      'catches sensitive screens that leak into the ios app switcher and android recents, which is a real banking-app failure almost nobody tests for. checks against MASVS-STORAGE-9 and PCI.',
    stack: ['Python', 'iOS', 'Android', 'MASVS'],
    repo: 'https://github.com/ethanzhoucool/redaction-checker',
    live: null,
  },
  {
    slug: 'atlas-pr-diff',
    title: 'Atlas PR Diff',
    blurb:
      'a ci bot that walks your app on every build, diffs the screen graph against the base branch, and comments what changed and which flows are now untested.',
    stack: ['Python', 'GitHub Actions', 'CI'],
    repo: 'https://github.com/ethanzhoucool/atlas-pr-diff',
    live: null,
  },
  {
    slug: 'autonomous-robot',
    title: 'Autonomous Robot',
    blurb:
      'arduino mega controller for a robot that drives itself. gps for navigation, lidar so it stops hitting things, pid on the motors.',
    stack: ['C++', 'Arduino', 'LiDAR', 'PID'],
    repo: 'https://github.com/ethanzhoucool/1050-autonomous-robot',
    live: null,
  },
  {
    slug: 'device-gif-maker',
    title: 'Device GIF Maker',
    blurb:
      'point it at a flow and it drives a real device, records it, and returns a clean looping gif on a pristine device frame.',
    stack: ['Python', 'ffmpeg'],
    repo: 'https://github.com/ethanzhoucool/device-gif-maker',
    live: null,
  },
  {
    slug: 'explain-my-code',
    title: 'Explain my Code',
    blurb: 'paste code, get it explained like you are five. my first one, and the only one here you can click.',
    stack: ['Python', 'LLM'],
    repo: 'https://github.com/ethanzhoucool/explain-my-code',
    live: 'https://explain-my-code-w3sj.onrender.com/',
    media: {
      type: 'video',
      src: '/images/explain-my-code.mp4',
      poster: '/images/explain-my-code-poster.jpg',
    },
  },
];

/* Shown as a quiet closing line under the grid, not as more cards. */
export const MORE_REPOS = [
  { name: 'mobile-devtools', url: 'https://github.com/ethanzhoucool/mobile-devtools' },
];

export const GITHUB_URL = 'https://github.com/ethanzhoucool';
