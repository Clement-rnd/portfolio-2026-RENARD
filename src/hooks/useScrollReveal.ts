import type { Target, Transition, ViewportOptions } from "framer-motion";

export interface UseScrollRevealOptions {
  /** Additional delay (s) before the reveal starts, for staggering sections. */
  delay?: number;
  /** Starting vertical offset (px) the section slides up from. */
  y?: number;
  /** Reveal duration (s). */
  duration?: number;
  /** Reveal once when entering the viewport, or every time. */
  once?: boolean;
  /** Fraction of the element that must be visible to trigger the reveal. */
  amount?: number;
}

export interface ScrollRevealProps {
  initial: Target;
  whileInView: Target;
  viewport: ViewportOptions;
  transition: Transition;
}

/**
 * Spread onto a `motion.*` component to get the fade + slide-up
 * "reveal on scroll" effect: opacity 0 -> 1, y: 100px -> 0.
 *
 * @example
 * <motion.section {...useScrollReveal({ delay: 0.2 })}>
 */
export function useScrollReveal({
  delay = 0,
  y = 100,
  duration = 1,
  once = true,
  amount = 0.2,
}: UseScrollRevealOptions = {}): ScrollRevealProps {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once, amount },
    transition: { duration, delay, ease: "easeOut" },
  };
}
