import { Fragment } from "react";
import { motion } from "framer-motion";

// Approximation of GSAP's "power3.out" easing curve.
const EASE_POWER3_OUT = [0.215, 0.61, 0.355, 1] as const;

const TAGS = {
  p: "p",
  span: "span",
  div: "div",
} as const;

export type RevealWordsTag = keyof typeof TAGS;

export interface RevealWordsProps {
  text: string;
  /** Reveals the words when true, hides them again when false. */
  trigger: boolean;
  as?: RevealWordsTag;
  className?: string;
  wordClassName?: string;
  /** Base delay (s) before the first word starts revealing. */
  delay?: number;
  /** Delay (s) added between each word. */
  stagger?: number;
  duration?: number;
}

// Word-by-word fade + move wave, driven by an external boolean trigger (like
// RevealChars) rather than its own viewport check, so several instances can
// share one visibility check and a continuous cross-paragraph stagger.
export function RevealWords({
  text,
  trigger,
  as = "p",
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.05,
  duration = 0.5,
}: RevealWordsProps) {
  const words = text.split(" ");
  const Tag = TAGS[as];

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <motion.span
            className={`inline-block ${wordClassName}`}
            initial={{ opacity: 0, y: 16 }}
            animate={trigger ? { opacity: 1, y: 0 } : undefined}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: EASE_POWER3_OUT,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
