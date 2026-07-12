import { startTransition, useCallback, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { PageTransitionContext } from "../lib/PageTransitionContext";
import { TOTAL_EXIT_DURATION, WAIT_AFTER_EXIT } from "../lib/exitTransition";

export function Layout() {
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigateWithExit = useCallback(
    (href: string) => {
      setIsExiting(true);
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
        (TOTAL_EXIT_DURATION + WAIT_AFTER_EXIT) * 1000,
      );
    },
    [navigate],
  );

  return (
    <PageTransitionContext.Provider value={{ navigateWithExit, isExiting }}>
      <Nav />
      <Outlet key={location.key} />
      <Footer />
    </PageTransitionContext.Provider>
  );
}
