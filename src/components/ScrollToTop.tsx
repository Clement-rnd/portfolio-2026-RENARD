import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router doesn't reset scroll position on navigation by default, so a
// project card click would otherwise land on the new page at whatever
// scroll offset the previous page was at. useLayoutEffect (not useEffect)
// so this runs before the browser paints — otherwise the page-slide
// transition would briefly play at the old scroll position first.
export function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
