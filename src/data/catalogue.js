/*
 * Every YouTube short on @Ethanzhouwealth, view counts only, as of Aug 2026.
 * Scraped from the public channel, not rounded, not curated.
 *
 * The about page deals these out one at a time. That only means anything
 * because they are the real numbers: 201 at the bottom, 187,000 at the top,
 * and no way to tell in advance which video is which.
 */
export const CATALOGUE = [
  187000, 102000, 67000, 45000, 43000, 29000, 24000, 24000, 24000, 22000,
  22000, 21000, 20000, 18000, 17000, 16000, 16000, 14000, 13000, 13000,
  11000, 11000, 10000, 9700, 7900, 6900, 6700, 6500, 5200, 5200,
  4400, 4100, 3600, 3400, 3300, 2500, 2300, 2100, 2100, 1900,
  962, 948, 354, 234, 223, 212, 209, 201,
];

export const CATALOGUE_TOTAL = CATALOGUE.reduce((a, b) => a + b, 0);
export const CATALOGUE_BEST = CATALOGUE[0];
