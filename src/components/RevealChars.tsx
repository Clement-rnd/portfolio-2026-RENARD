import { Fragment } from "react";
import { motion } from "framer-motion";
import { EXIT_DISTANCE, EXIT_DURATION } from "../lib/exitTransition";

// Approximation of GSAP's "power3.out" easing curve.
const EASE_POWER3_OUT = [0.215, 0.61, 0.355, 1] as const;

const charVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
  exiting: { opacity: 0, y: -EXIT_DISTANCE },
};

export interface RevealCharsProps {
  text: string;
  /** Reveals the characters when true, hides them again when false. */
  trigger: boolean;
  /** Plays the exit variant (fade + move up), char by char, regardless of
   * `trigger` — used when the page itself is navigating away. */
  exiting?: boolean;
  /** Base delay (s) before this element's exit starts — e.g. a per-section
   * offset so sections leave top-to-bottom. */
  exitDelay?: number;
  className?: string;
  charClassName?: string;
  /** Base delay (s) before the first character starts revealing. */
  delay?: number;
  /** Delay (s) added between each character. */
  stagger?: number;
  duration?: number;
}

export function RevealChars({
  text,
  trigger,
  exiting = false,
  exitDelay = 0,
  className = "",
  charClassName = "",
  delay = 0,
  stagger = 0.02,
  duration = 0.5,
}: RevealCharsProps) {
  const lines = text.split("\n");
  let charIndex = 0;

  return (
    <span className={`inline ${className}`}>
      {lines.map((line, lineIndex) => {
        const words = line.split(" ");
        return (
          <Fragment key={lineIndex}>
            {lineIndex > 0 && <br />}
            {words.map((word, wordIndex) => (
              <Fragment key={wordIndex}>
                <span className="inline-block whitespace-nowrap">
                  {word.split("").map((char, i) => {
                    const index = charIndex++;
                    return (
                      <motion.span
                        key={i}
                        className={`inline-block ${charClassName}`}
                        variants={charVariants}
                        initial="hidden"
                        animate={
                          exiting ? "exiting" : trigger ? "visible" : "hidden"
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
          </Fragment>
        );
      })}
    </span>
  );
}
