// Shared constants for the page-exit animation: every reveal primitive
// (RevealChars, RevealWords, AnimatedHeading, useEntranceReveal,
// useScrollReveal) mirrors its own entrance style in reverse — fade out
// while moving up the same distance it moved in from — using these same
// values, so the site-wide exit feels consistent regardless of which
// element is leaving.
export const EXIT_DURATION = 0.4;
export const EXIT_DISTANCE = 40;
export const WAIT_AFTER_EXIT = 0.4;

// The entrance sequence reveals bottom-to-top (e.g. the hero's own content
// before the nav bar above it), so the exit deliberately goes the other way
// — top-to-bottom — via a per-section base delay added on top of each
// element's own char/word stagger. Nav isn't included: it's a persistent
// layout element and doesn't exit on every navigation.
export const EXIT_SECTION_STAGGER = 0.08;
export const EXIT_SECTION_ORDER = {
  hero: 0,
  projects: 1,
  about: 2,
  process: 3,
  footer: 4,
} as const;

export function exitSectionDelay(section: keyof typeof EXIT_SECTION_ORDER) {
  return EXIT_SECTION_ORDER[section] * EXIT_SECTION_STAGGER;
}

// Total time from the moment the exit starts to when the last section
// finishes leaving — Layout waits this long (plus WAIT_AFTER_EXIT) before
// actually navigating, so nothing gets cut off mid-exit.
const LAST_SECTION_DELAY =
  Object.values(EXIT_SECTION_ORDER).length > 0
    ? (Object.values(EXIT_SECTION_ORDER).length - 1) * EXIT_SECTION_STAGGER
    : 0;
export const TOTAL_EXIT_DURATION = LAST_SECTION_DELAY + EXIT_DURATION;
