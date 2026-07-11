import type { Target, Transition } from "framer-motion";

export interface UseEntranceRevealOptions {
  /** Delay (s) before this element starts revealing, for staggering a sequence. */
  delay?: number;
  /** Starting vertical offset (px) the element slides up from. */
  y?: number;
  duration?: number;
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
}: UseEntranceRevealOptions = {}): EntranceRevealProps {
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay, ease: "easeOut" },
  };
}
