// Entrance sequence for a project page (e.g. /projects/naya): the baseline
// (tagline) arrives first, then the cover image, then the small overline
// label — both text elements revealed letter by letter. The nav (shared
// across routes, so this only matters on a fresh mount — a direct load/
// refresh of a project page) is timed to arrive last, after the sequence
// below finishes.

export const PROJECT_BASELINE_STAGGER = 0.02;
export const PROJECT_BASELINE_CHAR_DURATION = 0.4;

export const PROJECT_TITLE_STAGGER = 0.02;
export const PROJECT_TITLE_CHAR_DURATION = 0.3;

export const PROJECT_COVER_DURATION = 0.6;

const OVERLAP = 0.7; // fraction of the previous step still playing when the next starts

/** Computes the baseline/cover/title delays from the actual tagline and
 * title lengths, so the sequence timing scales with the real text. */
export function getProjectSequence(baselineText: string, titleText: string) {
  const baselineCharCount = baselineText.split(" ").join("").length;
  const baselineRevealEnd =
    (baselineCharCount - 1) * PROJECT_BASELINE_STAGGER +
    PROJECT_BASELINE_CHAR_DURATION;

  const coverDelay = baselineRevealEnd * OVERLAP;
  const titleDelay = coverDelay + PROJECT_COVER_DURATION * OVERLAP;

  const titleCharCount = titleText.split(" ").join("").length;
  const titleRevealEnd =
    titleDelay + (titleCharCount - 1) * PROJECT_TITLE_STAGGER + PROJECT_TITLE_CHAR_DURATION;

  return {
    baselineDelay: 0,
    coverDelay,
    titleDelay,
    navDelay: titleRevealEnd + 0.2,
  };
}
