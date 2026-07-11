import { useState } from "react";

/**
 * Tracks a boolean "revealed" state that stays revealed after the pointer
 * leaves, but replays (snap back, then re-animate) on every new hover/focus
 * — without ever remounting the animated DOM nodes, so clicks on them never
 * get dropped mid-gesture.
 */
export function useHoverReplay() {
  const [isHovered, setIsHovered] = useState(false);

  const trigger = () => {
    if (isHovered) {
      setIsHovered(false);
      requestAnimationFrame(() => setIsHovered(true));
    } else {
      setIsHovered(true);
    }
  };

  return { isHovered, trigger };
}
