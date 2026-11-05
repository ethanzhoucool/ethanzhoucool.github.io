/*
 * Real projects, real links. Descriptions are rewritten from each repo's own
 * description in Ethan's lowercase voice. No invented metrics, no fake stars.
 *
 * Ordered by engineering weight, not by what is fun to look at. The games
 * (gta7-js, imposter-word) are deliberately not here: they are still on the
 * GitHub profile, but they are not what this page is arguing.
 *
 * `art` names the artifact each project renders. These are not decorative
 * mockups of a product that does not exist — each one is the shape of that
 * tool's real output: the comment the bot leaves, the report the scanner
 * prints, the frame the recorder returns. `media` is still only set where a
 * real recorded asset exists on disk.
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
  art: 'dropoff',
};

/* The second feature row. It gets the full-width treatment because its
   artifact is the phone demo, which needs the height. */
export const FEATURED_TWO = {
  slug: 'redaction-checker',
  title: 'Redaction Checker',
  blurb:
    'ios and android snapshot the screen every time you background an app. if a balance or a card number is on screen when that happens, it lands in the recents switcher in plaintext. banks fail this constantly and almost nobody tests for it.',
  stack: ['Python', 'iOS', 'Android', 'MASVS'],
  repo: 'https://github.com/ethanzhoucool/redaction-checker',
  live: null,
  art: 'scan',
};

/* The third feature row. A whole native app, not a script, so it gets the
   width: the artifact is a live schematic with its waveform underneath. */
export const FEATURED_THREE = {
  slug: 'quartzite-mac',
  title: 'Quartzite',
  blurb:
    'apple silicon macs cannot run quartus, which is a problem when your digital-logic lab requires it. so i wrote a native macos schematic editor that simulates the circuit and exports a real quartus project for the cyclone v board.',
  stack: ['Swift', 'macOS', 'Digital Logic', 'FPGA'],
  repo: 'https://github.com/ethanzhoucool/quartzite-mac',
  live: null,
  note: ['editor + simulator + compile report', 'exports .bdf / .qsf / .vwf'],
  art: 'schematic',
};

export const PROJECTS = [
  {
    slug: 'mobile-bisect',
    title: 'mobile-bisect',
    blurb:
      'git bisect for mobile. it replays the broken flow on a cloud device across a commit range, decides pass or fail by looking at the app, and names the commit that broke it.',
    stack: ['TypeScript', 'CLI', 'Cloud Devices'],
    repo: 'https://github.com/ethanzhoucool/mobile-bisect',
    live: null,
    art: 'bisect',
  },
  {
    slug: 'atlas-review',
    title: 'Atlas Review',
    blurb:
      'visual review for every screen in an app. build-over-build diffs, the first build where something changed, approvals and alerts, all in one self-contained html file.',
    stack: ['Python', 'CLI', 'Visual Diff'],
    repo: 'https://github.com/ethanzhoucool/atlas-review',
    live: null,
    art: 'review',
  },
  {
    slug: 'lumen',
    title: 'Lumen',
    blurb:
      'a swiftui rewards wallet packed with about a dozen animations, several of them gating the main action. built as the app ui test tools flake on.',
    stack: ['Swift', 'SwiftUI', 'iOS'],
    repo: 'https://github.com/ethanzhoucool/lumen',
    live: null,
    art: 'wallet',
  },
  {
    slug: 'x-launch-filter',
    title: 'X Launch Filter',
    blurb:
      'a chrome extension that cuts the x home timeline down to launch and product posts. failing posts are dropped from the api response before x ever renders them.',
    stack: ['JavaScript', 'Chrome MV3'],
    repo: 'https://github.com/ethanzhoucool/x-launch-filter',
    live: null,
    art: 'feed',
  },
  {
    slug: 'atlas-pr-diff',
    title: 'Atlas PR Diff',
    blurb:
      'a ci bot that walks your app on every build, diffs the screen graph against the base branch, and comments what changed and which flows are now untested.',
    stack: ['Python', 'GitHub Actions', 'CI'],
    repo: 'https://github.com/ethanzhoucool/atlas-pr-diff',
    live: null,
    art: 'comment',
  },
  {
    slug: 'autonomous-robot',
    title: 'Autonomous Robot',
    blurb:
      'arduino mega controller for a robot that drives itself. gps for navigation, lidar so it stops hitting things, pid on the motors.',
    stack: ['C++', 'Arduino', 'LiDAR', 'PID'],
    repo: 'https://github.com/ethanzhoucool/1050-autonomous-robot',
    live: null,
    art: 'robot',
  },
  {
    slug: 'device-gif-maker',
    title: 'Device GIF Maker',
    blurb:
      'point it at a flow and it drives a real device, records it, and returns a clean looping gif on a pristine device frame.',
    stack: ['Python', 'ffmpeg'],
    repo: 'https://github.com/ethanzhoucool/device-gif-maker',
    live: null,
    art: 'gif',
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
  { name: 'wealthscope-dashboard', url: 'https://github.com/ethanzhoucool/wealthscope-dashboard' },
  { name: 'glow-vitalrise', url: 'https://github.com/ethanzhoucool/glow-vitalrise' },
];

export const GITHUB_URL = 'https://github.com/ethanzhoucool';
