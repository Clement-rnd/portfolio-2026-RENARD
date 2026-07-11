import { motion } from "framer-motion";

// Approximation of GSAP's "power3.out" easing curve.
const EASE_POWER3_OUT = [0.215, 0.61, 0.355, 1] as const;

const transition = { duration: 0.4, ease: EASE_POWER3_OUT };

const lineProps = {
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
};

export interface BurgerIconProps {
  isOpen: boolean;
  size?: number;
  className?: string;
}

// Matches the "menu-11" icon from the Figma file (28x24 grid, shorter
// right-aligned middle line), with the lines tweening directly into the X
// shape (real position animation, not a cross-fade between two icons).
export function BurgerIcon({ isOpen, size = 28, className = "" }: BurgerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <motion.line
        {...lineProps}
        animate={
          isOpen
            ? { x1: 7, y1: 7, x2: 21, y2: 21 }
            : { x1: 4.67, y1: 5.83, x2: 23.33, y2: 5.83 }
        }
        transition={transition}
      />
      <motion.line
        {...lineProps}
        animate={
          isOpen
            ? { opacity: 0, x1: 14, y1: 14, x2: 14, y2: 14 }
            : { opacity: 1, x1: 11.67, y1: 14, x2: 23.33, y2: 14 }
        }
        transition={transition}
      />
      <motion.line
        {...lineProps}
        animate={
          isOpen
            ? { x1: 7, y1: 21, x2: 21, y2: 7 }
            : { x1: 4.67, y1: 22.17, x2: 23.33, y2: 22.17 }
        }
        transition={transition}
      />
    </svg>
  );
}
