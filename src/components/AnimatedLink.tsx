import { useState } from "react";
import { motion } from "framer-motion";
import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { HoverChars } from "./HoverChars";
import { scrollToId } from "../lib/scroll";

type NativeAnchorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children" | "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"
>;

export interface AnimatedLinkProps extends NativeAnchorProps {
  children: string;
  /** If set, smooth-scrolls to this element id instead of following href. */
  scrollToAnchor?: string;
  /** Applied to each character's mask box, e.g. vertical padding so hover
   * reveal/hide clips at the link's real edges instead of the text's own
   * line height. */
  charClassName?: string;
}

export function AnimatedLink({
  children,
  className = "",
  charClassName,
  scrollToAnchor,
  onClick,
  href,
  ...props
}: AnimatedLinkProps) {
  const [hoverKey, setHoverKey] = useState(0);
  const replay = () => setHoverKey((key) => key + 1);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (scrollToAnchor) {
      event.preventDefault();
      scrollToId(scrollToAnchor);
    }
    onClick?.(event);
  };

  return (
    <motion.a
      href={scrollToAnchor ? `#${scrollToAnchor}` : href}
      onClick={handleClick}
      onHoverStart={replay}
      onFocus={replay}
      className={`relative inline-flex overflow-hidden ${className}`}
      {...props}
    >
      <HoverChars
        text={children}
        charClassName={charClassName}
        hoverKey={hoverKey}
      />
    </motion.a>
  );
}
