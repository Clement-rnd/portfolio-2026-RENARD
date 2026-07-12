import { Fragment, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EXIT_DISTANCE, EXIT_DURATION } from "../lib/exitTransition";

// Approximation of GSAP's "power3.out" easing curve.
const EASE_POWER3_OUT = [0.215, 0.61, 0.355, 1] as const;

const TAGS = {
  p: "p",
  span: "span",
  div: "div",
} as const;

export type RevealWordsTag = keyof typeof TAGS;

export interface RevealWordItem {
  text: string;
  /** Fades to `dimOpacity` instead of fully opaque once revealed, while
   * `dimEnabled` is true (e.g. the "TL;DR" mode). */
  dimmed?: boolean;
}

export interface RevealWordsProps {
  /** Plain text (split on spaces), or pre-split words with per-word
   * `dimmed` flags for the highlight/TL;DR effect. */
  words: string | RevealWordItem[];
  /** Reveals the words when true, hides them again when false. */
  trigger: boolean;
  /** Plays the exit variant (fade + move up), word by word, regardless of
   * `trigger` — used when the page itself is navigating away. */
  exiting?: boolean;
  /** Base delay (s) before this element's exit starts — e.g. a per-section
   * offset so sections leave top-to-bottom. */
  exitDelay?: number;
  /** Fades `dimmed` words to `dimOpacity`; toggling this (after the initial
   * reveal) replays a fast staggered wave rather than the full reveal stagger. */
  dimEnabled?: boolean;
  dimOpacity?: number;
  as?: RevealWordsTag;
  className?: string;
  wordClassName?: string;
  /** Base delay (s) before the first word starts revealing. */
  delay?: number;
  /** Delay (s) added between each word. */
  stagger?: number;
  duration?: number;
  /** Delay (s) added between each word when a dim/undim toggle replays
   * (after the initial reveal). Defaults to `stagger`. */
  toggleStagger?: number;
  /** Base delay (s) before this instance's toggle wave starts, so several
   * instances can chain into one continuous top-to-bottom cascade. */
  toggleDelay?: number;
  /** Duration (s) of each word's fade when a dim/undim toggle replays. */
  toggleDuration?: number;
}

// Word-by-word fade + move wave, driven by an external boolean trigger (like
// RevealChars) rather than its own viewport check, so several instances can
// share one visibility check and a continuous cross-paragraph stagger.
export function RevealWords({
  words,
  trigger,
  exiting = false,
  exitDelay = 0,
  dimEnabled = false,
  dimOpacity = 0.35,
  as = "p",
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.05,
  duration = 0.5,
  toggleStagger,
  toggleDelay = 0,
  toggleDuration = 0.2,
}: RevealWordsProps) {
  const items: RevealWordItem[] =
    typeof words === "string"
      ? words.split(" ").map((text) => ({ text }))
      : words;
  const Tag = TAGS[as];

  // The toggle wave only staggers across words that actually change opacity
  // (the `dimmed` ones), so it ripples through them back-to-back in reading
  // order instead of pausing through every stable word in between.
  let dimmedCount = 0;
  const dimmedIndexes = items.map((item) => {
    if (!item.dimmed) return 0;
    const index = dimmedCount;
    dimmedCount += 1;
    return index;
  });

  // Once the initial reveal has played, later dim/undim toggles replay their
  // own (faster) staggered wave instead of the full reveal-in stagger/delay.
  const [hasRevealed, setHasRevealed] = useState(false);
  useEffect(() => {
    if (trigger) setHasRevealed(true);
  }, [trigger]);

  return (
    <Tag className={className}>
      {items.map((item, i) => {
        const targetOpacity = exiting
          ? 0
          : !trigger
            ? 0
            : dimEnabled && item.dimmed
              ? dimOpacity
              : 1;
        const targetY = exiting ? -EXIT_DISTANCE : trigger ? 0 : 16;
        const transition = exiting
          ? {
              duration: EXIT_DURATION,
              delay: exitDelay + i * stagger,
              ease: EASE_POWER3_OUT,
            }
          : hasRevealed
            ? {
                duration: toggleDuration,
                delay: item.dimmed
                  ? toggleDelay + dimmedIndexes[i] * (toggleStagger ?? stagger)
                  : 0,
                ease: "easeOut" as const,
              }
            : { duration, delay: delay + i * stagger, ease: EASE_POWER3_OUT };

        return (
          <Fragment key={i}>
            <motion.span
              className={`inline-block ${wordClassName}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: targetOpacity, y: targetY }}
              transition={transition}
            >
              {item.text}
            </motion.span>
            {i < items.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </Tag>
  );
}
