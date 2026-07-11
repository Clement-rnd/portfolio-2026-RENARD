import { animate } from "framer-motion";

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Smooth-scrolls to the element with the given id (easeInOutCubic, 900ms). */
export function scrollToId(id: string, duration = 0.9) {
  const el = document.getElementById(id);
  if (!el) return;

  const start = window.scrollY;
  const target = start + el.getBoundingClientRect().top;

  animate(0, 1, {
    duration,
    ease: easeInOutCubic,
    onUpdate: (progress) => {
      window.scrollTo(0, start + (target - start) * progress);
    },
  });
}

/** Smooth-scrolls back to the top of the page (easeInOutCubic, 900ms). */
export function scrollToTop(duration = 0.9) {
  const start = window.scrollY;

  animate(0, 1, {
    duration,
    ease: easeInOutCubic,
    onUpdate: (progress) => {
      window.scrollTo(0, start * (1 - progress));
    },
  });
}
