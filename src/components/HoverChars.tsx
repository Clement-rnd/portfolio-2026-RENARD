import { motion } from "framer-motion";

// Approximation of GSAP's "power3.out" easing curve.
const EASE_POWER3_OUT = [0.215, 0.61, 0.355, 1] as const;

export interface HoverCharsProps {
  text: string;
  className?: string;
  /** Applied to each character's own mask box (e.g. vertical padding) so the
   * reveal/hide clips at the button's real edges instead of the text's own
   * line height. */
  charClassName?: string;
  stagger?: number;
  duration?: number;
  /** Bump this on each hover start to (re)play the reveal; the end state
   * persists after the pointer leaves instead of reverting. */
  hoverKey?: number;
}

export function HoverChars({
  text,
  className = "",
  charClassName = "",
  stagger = 0.02,
  duration = 0.5,
  hoverKey = 0,
}: HoverCharsProps) {
  const chars = [...text].map((char) => (char === " " ? " " : char));
  const isHovered = hoverKey > 0;

  return (
    <span key={hoverKey} className={`relative inline-flex ${className}`}>
      {chars.map((char, i) => (
        <span
          key={i}
          className={`relative inline-flex overflow-hidden ${charClassName}`}
        >
          {/* Invisible spacer: gives the box its real height so the layers below translate by a full slot. */}
          <span className="invisible">{char}</span>
          <motion.span
            className="absolute inset-0 flex items-center justify-center"
            initial={{ y: "0%", opacity: 1 }}
            animate={isHovered ? { y: "-100%", opacity: 0 } : undefined}
            transition={{ duration, delay: i * stagger, ease: EASE_POWER3_OUT }}
          >
            {char}
          </motion.span>
          <motion.span
            aria-hidden="true"
            className="absolute left-0 right-0 top-full h-full flex items-center justify-center"
            initial={{ y: "0%", opacity: 0 }}
            animate={isHovered ? { y: "-100%", opacity: 1 } : undefined}
            transition={{ duration, delay: i * stagger, ease: EASE_POWER3_OUT }}
          >
            {char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
