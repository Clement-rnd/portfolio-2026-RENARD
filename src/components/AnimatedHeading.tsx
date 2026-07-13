import { motion, useInView } from "framer-motion";
import { Fragment, useMemo, useRef } from "react";
import { EXIT_DISTANCE, EXIT_DURATION } from "../lib/exitTransition";

// Approximation of GSAP's "power3.out" easing curve.
const EASE_POWER3_OUT = [0.215, 0.61, 0.355, 1] as const;

const MOTION_TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

export type AnimatedHeadingTag = keyof typeof MOTION_TAGS;

export interface AnimatedHeadingProps {
  text: string;
  as?: AnimatedHeadingTag;
  className?: string;
  charClassName?: string;
  /** Delay (s) before the first character starts revealing. */
  delay?: number;
  /** Delay (s) added between each character. */
  stagger?: number;
  /** Duration (s) of a single character's reveal. */
  duration?: number;
  /** Reveal once when entering the viewport, or every time. */
  once?: boolean;
  /** Fraction of the element that must be visible to trigger the reveal. */
  amount?: number;
  /** Plays the exit variant (fades out), char by char, regardless of
   * viewport state — used when the page itself is navigating away. */
  exiting?: boolean;
  /** Base delay (s) before this element's exit starts — e.g. a per-section
   * offset so sections leave top-to-bottom. */
  exitDelay?: number;
}

export function AnimatedHeading({
  text,
  as = "h1",
  className = "",
  charClassName = "",
  delay = 0,
  stagger = 0.02,
  duration = 0.8,
  once = true,
  amount = 0.5,
  exiting = false,
  exitDelay = 0,
}: AnimatedHeadingProps) {
  const words = useMemo(() => text.split(" "), [text]);
  const MotionTag = MOTION_TAGS[as];
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  let charIndex = 0;

  return (
    <MotionTag ref={ref} className={className} aria-label={text}>
      {words.map((word, wordIndex) => (
        <Fragment key={wordIndex}>
          <span
            className="inline-block whitespace-nowrap"
            style={{ lineHeight: 1 }}
            aria-hidden="true"
          >
            {word.split("").map((char, i) => {
              const index = charIndex++;
              return (
                <motion.span
                  key={i}
                  className={`inline-block ${charClassName}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={
                    exiting
                      ? { opacity: 0, y: -EXIT_DISTANCE }
                      : isInView
                        ? { opacity: 1, y: 0 }
                        : undefined
                  }
                  transition={{
                    duration: exiting ? EXIT_DURATION : duration,
                    delay: exiting
                      ? exitDelay + index * stagger
                      : delay + index * stagger,
                    ease: EASE_POWER3_OUT,
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
          {wordIndex < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </MotionTag>
  );
}
