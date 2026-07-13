import { EXIT_SECTION_STAGGER } from "./exitTransition";

export const HERO_TITLE_TEXT = "Salut, moi c’est Clément !";
export const HERO_TITLE_LINE_1 = "Salut,";
export const HERO_TITLE_LINE_2 = "moi c’est Clément !";
export const HERO_TITLE_STAGGER = 0.02;
export const HERO_TITLE_CHAR_DURATION = 0.4;

const line1CharCount = HERO_TITLE_LINE_1.split(" ").join("").length;

/** Delay (s) for the second line, continuing line 1's letter stagger. */
export const HERO_TITLE_LINE_2_DELAY = line1CharCount * HERO_TITLE_STAGGER;

export const HERO_PARAGRAPH_TEXT =
  "Un product designer situé à Bordeaux. J’adore créer des interfaces à l’expérience mémorables pour les utilisateurs !";
export const HERO_PARAGRAPH_STAGGER = 0.03;
export const HERO_PARAGRAPH_WORD_DURATION = 0.4;

/** Duration (s) for the projects/buttons/nav fade+move steps. */
export const HERO_STEP_DURATION = 0.4;

/** Fraction of a step's duration still playing when the next one starts —
 * 0 = fully sequential (feels robotic), 0.5 = the two nearly play at once
 * (order gets hard to read). This is the middle ground: each step is
 * already reading clearly before the next begins, but nothing waits idle. */
const OVERLAP = 0.3;

const titleCharCount = HERO_TITLE_TEXT.split(" ").join("").length;

/** Total time (s) for the title's letter-by-letter reveal to fully finish. */
export const HERO_TITLE_REVEAL_END =
  (titleCharCount - 1) * HERO_TITLE_STAGGER + HERO_TITLE_CHAR_DURATION;

function nextStart(previousStart: number, previousDuration: number) {
  return previousStart + previousDuration * (1 - OVERLAP);
}

// Order: title -> paragraph -> then the rest bottom-to-top (projects peek ->
// CTA -> nav). The paragraph starts halfway through the title's reveal
// rather than waiting for it to finish; the rest each start once the
// previous one is mostly (not fully) done.
export const HERO_PARAGRAPH_DELAY = HERO_TITLE_REVEAL_END * 0.5;

const paragraphWordCount = HERO_PARAGRAPH_TEXT.split(" ").length;
const paragraphDuration =
  (paragraphWordCount - 1) * HERO_PARAGRAPH_STAGGER +
  HERO_PARAGRAPH_WORD_DURATION;

export const HERO_PROJECTS_DELAY = nextStart(
  HERO_PARAGRAPH_DELAY,
  paragraphDuration,
);

export const HERO_BUTTONS_DELAY = nextStart(
  HERO_PROJECTS_DELAY,
  HERO_STEP_DURATION,
);

export const HERO_NAV_DELAY = nextStart(
  HERO_BUTTONS_DELAY,
  HERO_STEP_DURATION,
);

// Exit mirrors the hero's own top-to-bottom order (title -> paragraph ->
// buttons) instead of every element leaving at once, but — unlike the
// entrance above — only offsets when each one *starts*, by the same small
// flat beat used between sections. Waiting for each one to fully finish
// before the next starts (like the entrance does) reads as sluggish on the
// way out, since exits are meant to feel quick.
export const HERO_PARAGRAPH_EXIT_DELAY = EXIT_SECTION_STAGGER;
export const HERO_BUTTONS_EXIT_DELAY = EXIT_SECTION_STAGGER * 2;
