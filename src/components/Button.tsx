import { motion } from "framer-motion";
import type { ButtonHTMLAttributes } from "react";
import { HoverChars } from "./HoverChars";
import { Squircle } from "./Squircle";
import { useHoverReplay } from "../hooks/useHoverReplay";

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"
>;

export interface ButtonProps extends NativeButtonProps {
  children: string;
  /** Applied to each character's mask box, e.g. vertical padding so hover
   * reveal/hide clips at the button's real edges instead of the text's own
   * line height. */
  charClassName?: string;
  /** Classes for the outer squircle wrapper (e.g. `flex-1` in a button row). */
  wrapperClassName?: string;
  /** Squircle background fill. */
  fill?: string;
  /** Squircle border color; omit for no border. */
  borderColor?: string;
  cornerRadius?: number;
  cornerSmoothing?: number;
}

export function Button({
  children,
  className = "",
  charClassName,
  wrapperClassName = "",
  fill = "transparent",
  borderColor,
  cornerRadius = 8,
  cornerSmoothing = 1,
  ...props
}: ButtonProps) {
  const { isHovered, trigger } = useHoverReplay();

  return (
    <Squircle
      cornerRadius={cornerRadius}
      cornerSmoothing={cornerSmoothing}
      fill={fill}
      borderColor={borderColor ?? "transparent"}
      borderWidth={borderColor ? 1.5 : 0}
      className={`inline-flex ${wrapperClassName}`}
    >
      <motion.button
        type="button"
        onHoverStart={trigger}
        onFocus={trigger}
        className={`relative inline-flex overflow-hidden font-medium ${className}`}
        {...props}
      >
        <HoverChars
          text={children}
          charClassName={charClassName}
          isHovered={isHovered}
        />
      </motion.button>
    </Squircle>
  );
}
