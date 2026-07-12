import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Outlet, useNavigate } from "react-router-dom";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { PageTransitionContext } from "../lib/PageTransitionContext";

// Mirrors the site's usual entrance reveal (fade + move up into place) in
// reverse: fade out while moving up the same distance, then a short pause,
// then the actual navigation — so the new page's own entrance sequence
// starts on a clean, empty page instead of overlapping the old one.
const EXIT_DURATION = 0.4;
const EXIT_DISTANCE = 40;
const WAIT_AFTER_EXIT = 0.25;

export function Layout() {
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  const navigateWithExit = useCallback(
    (href: string) => {
      setIsExiting(true);
      setTimeout(
        () => {
          navigate(href);
          setIsExiting(false);
        },
        (EXIT_DURATION + WAIT_AFTER_EXIT) * 1000,
      );
    },
    [navigate],
  );

  return (
    <PageTransitionContext.Provider value={{ navigateWithExit }}>
      <Nav />
      <motion.div
        animate={
          isExiting
            ? { opacity: 0, y: -EXIT_DISTANCE }
            : { opacity: 1, y: 0 }
        }
        transition={{ duration: EXIT_DURATION, ease: "easeOut" }}
      >
        <Outlet />
      </motion.div>
      <Footer />
    </PageTransitionContext.Provider>
  );
}
