import { motion } from "framer-motion";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { AnimatedHeading } from "./AnimatedHeading";
import { HoverChars } from "./HoverChars";
import { scrollToId } from "../lib/scroll";
import { useHoverReplay } from "../hooks/useHoverReplay";
import { usePageTransition } from "../lib/PageTransitionContext";

type NativeAnchorProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children" | "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"
>;

export interface AnimatedLinkProps extends NativeAnchorProps {
  children: string;
  /** If set, smooth-scrolls to this element id instead of following href. */
  scrollToAnchor?: string;
  /** Gap (px) to leave above the target element when using scrollToAnchor. */
  scrollOffset?: number;
  /** Applied to each character's mask box, e.g. vertical padding so hover
   * reveal/hide clips at the link's real edges instead of the text's own
   * line height. */
  charClassName?: string;
  /** Static icon shown next to the animated text (not itself animated). */
  icon?: ReactNode;
  /** Reveal the text letter-by-letter on scroll instead of the default
   * hover-slide effect. */
  revealOnScroll?: boolean;
  /** Delay (s) before the scroll reveal starts, for staggering a list. */
  revealDelay?: number;
}

export function AnimatedLink({
  children,
  className = "",
  charClassName,
  scrollToAnchor,
  scrollOffset = 0,
  onClick,
  href,
  icon,
  revealOnScroll = false,
  revealDelay = 0,
  ...props
}: AnimatedLinkProps) {
  const { isHovered, trigger } = useHoverReplay();
  const { navigateWithExit } = usePageTransition();

  // Internal routes (e.g. /projects/naya) navigate client-side via React
  // Router instead of a full page reload; external/new-tab/download links
  // (target set) and mailto: links are left to the browser as normal.
  const isInternalRoute =
    !scrollToAnchor && href?.startsWith("/") && !props.target;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (scrollToAnchor) {
      event.preventDefault();
      scrollToId(scrollToAnchor, undefined, scrollOffset);
    } else if (isInternalRoute) {
      event.preventDefault();
      navigateWithExit(href!);
    }
    onClick?.(event);
  };

  return (
    <motion.a
      href={scrollToAnchor ? `#${scrollToAnchor}` : href}
      onClick={handleClick}
      onHoverStart={trigger}
      onFocus={trigger}
      className={`relative inline-flex items-center gap-1.5 overflow-hidden ${className}`}
      {...props}
    >
      {revealOnScroll ? (
        <AnimatedHeading text={children} as="span" delay={revealDelay} />
      ) : (
        <HoverChars
          text={children}
          charClassName={charClassName}
          isHovered={isHovered}
        />
      )}
      {icon}
    </motion.a>
  );
}
