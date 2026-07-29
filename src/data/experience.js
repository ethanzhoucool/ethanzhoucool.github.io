/*
 * Taken from Ethan's LinkedIn, which is the source of truth he pointed at.
 *
 * The hand-written version this replaces was wrong in four ways: it had the
 * company as "United Lifts" (it is United Lift), listed that role as current
 * when it ended in Dec 2025, claimed 256% LinkedIn engagement where LinkedIn
 * says 137%, and omitted both Revyl and Turbo AI entirely, including the
 * current job.
 */

export const ROLES = [
  {
    org: 'Revyl',
    note: 'YC F24',
    role: 'Growth Engineer',
    kind: 'Internship',
    period: 'Mar 2026 to present',
    place: 'San Francisco',
    current: true,
    points: [
      'product hunt vercel day winner, 1 of 781',
      '5M impressions on X',
      'monthly signups from 47 to ~1,800, a 38x lift',
    ],
  },
  {
    org: 'Turbo AI',
    role: 'HT Creator',
    kind: 'Internship',
    period: 'Nov 2025 to Feb 2026',
    place: null,
    points: ['high-tier UGC'],
  },
  {
    org: 'United Lift Technologies',
    role: 'Marketing and Business Strategy',
    kind: 'Internship',
    period: 'Apr 2024 to Dec 2025',
    place: 'Calgary',
    points: [
      'refreshed 10+ web pages for UX, readability and SEO',
      'grew LinkedIn engagement 137%',
      'SEO work lifted search rankings 38%',
      'helped plan and launch a new product line',
    ],
  },
  {
    org: '@ethanzhouwealth',
    role: 'Independent Content Creator',
    period: 'Aug 2023 to present',
    place: 'youtube, tiktok, instagram',
    current: true,
    points: ['6M+ views and 20K+ followers across platforms'],
  },
];

export const EDUCATION = {
  school: 'Western University',
  degree: 'BEng Software Engineering',
  note: 'Ivey AEO',
  period: 'from Aug 2025',
};
