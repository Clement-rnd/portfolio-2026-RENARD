import { useEffect, useState } from "react";

const QUERY = "(min-width: 768px)";

// Mirrors Tailwind's `md` breakpoint, for logic that needs to know the
// breakpoint in JS (e.g. picking a different scroll-reveal trigger per
// layout) rather than just switching classes.
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const handleChange = () => setIsDesktop(mql.matches);
    handleChange();
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return isDesktop;
}
