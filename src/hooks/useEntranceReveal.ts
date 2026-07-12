import type { Target, Transition } from "framer-motion";
import { EXIT_DISTANCE, EXIT_DURATION } from "../lib/exitTransition";

export interface UseEntranceRevealOptions {
  /** Delay (s) before this element starts revealing, for staggering a sequence. */
  delay?: number;
  /** Starting vertical offset (px) the element slides up from. */
  y?: number;
  duration?: number;
  /** Plays the exit variant (fade + move up) instead — used when the page
   * itself is navigating away. */
  exiting?: boolean;
  /** Base delay (s) before this element's exit starts — e.g. a per-section
   * offset so sections leave top-to-bottom. */
  exitDelay?: number;
}

export interface EntranceRevealProps {
  initial: Target;
  animate: Target;
  transition: Transition;
}

/**
 * Spread onto a `motion.*` component to fade + slide it in on mount (e.g. the
 * initial page-load sequence), as opposed to `useScrollReveal` which waits
 * for the element to enter the viewport.
 *
 * @example
 * <motion.div {...useEntranceReveal({ delay: 0.2 })}>
 */
export function useEntranceReveal({
  delay = 0,
  y = 40,
  duration = 0.8,
  exiting = false,
  exitDelay = 0,
}: UseEntranceRevealOptions = {}): EntranceRevealProps {
  if (exiting) {
    return {
      initial: { opacity: 0, y },
      animate: { opacity: 0, y: -EXIT_DISTANCE },
      transition: { duration: EXIT_DURATION, delay: exitDelay, ease: "easeOut" },
    };
  }
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay, ease: "easeOut" },
  };
}
