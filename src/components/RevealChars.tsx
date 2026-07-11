import { Fragment } from "react";
import { motion } from "framer-motion";

// Approximation of GSAP's "power3.out" easing curve.
const EASE_POWER3_OUT = [0.215, 0.61, 0.355, 1] as const;

const charVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export interface RevealCharsProps {
  text: string;
  /** Reveals the characters when true, hides them again when false. */
  trigger: boolean;
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
  className = "",
  charClassName = "",
  delay = 0,
  stagger = 0.02,
  duration = 0.5,
}: RevealCharsProps) {
  const words = text.split(" ");
  let charIndex = 0;

  return (
    <span className={`inline ${className}`}>
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
                  animate={trigger ? "visible" : "hidden"}
                  transition={{
                    duration,
                    delay: delay + index * stagger,
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
    </span>
  );
}
