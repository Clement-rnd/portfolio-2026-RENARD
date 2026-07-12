import { createContext, useContext } from "react";

export interface PageTransitionContextValue {
  /** Plays the current page's exit animation, waits, then navigates. */
  navigateWithExit: (href: string) => void;
  /** True while the current page's elements should play their exit
   * animation (reverse of however they entered — char/word/block). */
  isExiting: boolean;
}

export const PageTransitionContext =
  createContext<PageTransitionContextValue | null>(null);

export function usePageTransition() {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within <Layout>");
  }
  return context;
}
