import fs from 'fs';
import path from 'path';

/*
 * Keeps framer-motion out of the bundle that every visitor downloads.
 *
 * Only the about narrative and the work page use it, and both are loaded with
 * React.lazy. The app shell used to import it for the pointer backdrop alone,
 * which put ~40 kB of gzipped animation library in front of a home page that
 * animates nothing with it.
 *
 * This walks the static import graph from src/index.js. Dynamic import()
 * edges are where the code splits, so they are deliberately not followed.
 */

const SRC = __dirname;
const STATIC_IMPORT = /(?:^|\n)\s*import\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g;

function resolveLocal(fromFile, spec) {
  const base = path.resolve(path.dirname(fromFile), spec);
  for (const candidate of [base, `${base}.js`, path.join(base, 'index.js')]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function staticGraph(entry) {
  const seen = new Set();
  const packages = new Map();
  const stack = [entry];
  while (stack.length) {
    const file = stack.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    if (!file.endsWith('.js')) continue;
    const code = fs.readFileSync(file, 'utf8');
    for (const [, spec] of code.matchAll(STATIC_IMPORT)) {
      if (spec.startsWith('.')) {
        const next = resolveLocal(file, spec);
        if (next) stack.push(next);
      } else {
        const name = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
        if (!packages.has(name)) packages.set(name, []);
        packages.get(name).push(path.relative(SRC, file));
      }
    }
  }
  return { files: [...seen].map((f) => path.relative(SRC, f)), packages };
}

const { files, packages } = staticGraph(path.join(SRC, 'index.js'));

test('the walk actually covers the shell', () => {
  for (const f of ['App.js', 'components/Home.js', 'components/Nav.js', 'components/ui.js']) {
    expect(files).toContain(f);
  }
});

test('the lazily loaded routes are not in the initial bundle', () => {
  expect(files).not.toContain('about/About.js');
  expect(files).not.toContain('components/Work.js');
});

test('nothing in the initial bundle imports framer-motion', () => {
  expect(packages.get('framer-motion') || []).toEqual([]);
});
