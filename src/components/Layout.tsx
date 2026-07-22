import { startTransition, useCallback, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { PageTransitionContext } from "../lib/PageTransitionContext";
import {
  PROJECT_TOTAL_EXIT_DURATION,
  TOTAL_EXIT_DURATION,
  WAIT_AFTER_EXIT,
} from "../lib/exitTransition";

export function Layout() {
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigateWithExit = useCallback(
    (href: string) => {
      setIsExiting(true);
      // Project detail pages have a much longer per-section exit-delay
      // ladder than the home page (see PROJECT_TOTAL_EXIT_DURATION) — using
      // the home page's shorter duration here would navigate away before a
      // project page's later sections even start fading out.
      const exitDuration = location.pathname.startsWith("/projects/")
        ? PROJECT_TOTAL_EXIT_DURATION
        : TOTAL_EXIT_DURATION;
      setTimeout(
        () => {
          // react-router wraps its own navigation state update in
          // startTransition. If our setIsExiting(false) weren't in the same
          // transition, it (a plain sync update) could commit before the
          // transition-priority route change lands — briefly un-exiting the
          // OLD page and replaying its entrance animation before it actually
          // unmounts.
          startTransition(() => {
            navigate(href);
            setIsExiting(false);
          });
        },
        (exitDuration + WAIT_AFTER_EXIT) * 1000,
      );
    },
    [navigate, location.pathname],
  );

  return (
    <PageTransitionContext.Provider value={{ navigateWithExit, isExiting }}>
      <Nav />
      <Outlet key={location.key} />
      <Footer />
    </PageTransitionContext.Provider>
  );
}
