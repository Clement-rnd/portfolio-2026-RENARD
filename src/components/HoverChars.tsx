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
  /** Reveals the characters when true, hides them again when false. Driven
   * by animate/transition props only (no remounting), so the DOM nodes stay
   * stable and clicks on the text never get dropped mid-gesture. */
  isHovered: boolean;
}

export function HoverChars({
  text,
  className = "",
  charClassName = "",
  stagger = 0.02,
  duration = 0.5,
  isHovered,
}: HoverCharsProps) {
  const chars = [...text].map((char) => (char === " " ? " " : char));

  return (
    <span className={`relative inline-flex ${className}`}>
      {chars.map((char, i) => {
        const transition = isHovered
          ? { duration, delay: i * stagger, ease: EASE_POWER3_OUT }
          : { duration: 0 };
        return (
          <span
            key={i}
            className={`relative inline-flex overflow-hidden ${charClassName}`}
          >
            {/* Invisible spacer: gives the box its real height so the layers below translate by a full slot. */}
            <span className="invisible">{char}</span>
            <motion.span
              className="absolute inset-0 flex items-center justify-center"
              animate={
                isHovered ? { y: "-100%", opacity: 0 } : { y: "0%", opacity: 1 }
              }
              transition={transition}
            >
              {char}
            </motion.span>
            <motion.span
              aria-hidden="true"
              className="absolute left-0 right-0 top-full h-full flex items-center justify-center"
              animate={
                isHovered ? { y: "-100%", opacity: 1 } : { y: "0%", opacity: 0 }
              }
              transition={transition}
            >
              {char}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}
