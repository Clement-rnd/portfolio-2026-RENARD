import { useCallback, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { EXIT_DISTANCE, EXIT_DURATION } from "../lib/exitTransition";
import { useScrollReveal } from "../hooks/useScrollReveal";

export interface ScreensCarouselProps {
  screens: string[];
  exiting?: boolean;
  exitDelay?: number;
}

const SCREEN_STAGGER = 0.1;

export function ScreensCarousel({
  screens,
  exiting = false,
  exitDelay = 0,
}: ScreensCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const gridRef = useRef(null);
  const isGridInView = useInView(gridRef, { once: true, amount: 0.2 });

  const updateActiveIndex = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;
    itemRefs.current.forEach((item, index) => {
      if (!item) return;
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(itemCenter - containerCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    setActiveIndex(closestIndex);
  }, []);

  return (
    <>
      {/* Mobile: full-bleed swipeable carousel with pagination dots. */}
      <motion.div
        {...useScrollReveal({ y: 40, duration: 0.5, amount: 0.2, exiting, exitDelay })}
        className="flex flex-col gap-6 md:hidden"
      >
        <div
          ref={scrollRef}
          onScroll={updateActiveIndex}
          className="-mx-4 flex snap-x snap-mandatory overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {screens.map((screen, index) => (
            <div
              key={screen}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className="w-screen shrink-0 snap-center px-4"
            >
              <img
                src={screen}
                alt=""
                className="h-auto w-full rounded-2xl drop-shadow-md"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2">
          {screens.map((screen, index) => (
            <button
              key={screen}
              type="button"
              onClick={() =>
                itemRefs.current[index]?.scrollIntoView({
                  behavior: "smooth",
                  inline: "center",
                  block: "nearest",
                })
              }
              aria-label={`Aller à l'écran ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? "w-6 bg-heading" : "w-2 bg-neutral-200"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Desktop: no swipe, screens laid out one after another, each
          revealed individually (not the whole block at once). Fixed
          6-column grid (ceil(11/2)) so any container width still wraps
          into exactly 2 rows. All rows share one trigger so the second
          row's cascade continues right after the first instead of
          waiting to individually scroll into view. */}
      <div ref={gridRef} className="hidden md:grid md:grid-cols-6 md:gap-6">
        {screens.map((screen, index) => (
          <motion.img
            key={screen}
            initial={{ opacity: 0, y: 40 }}
            animate={
              exiting
                ? { opacity: 0, y: -EXIT_DISTANCE }
                : isGridInView
                  ? { opacity: 1, y: 0 }
                  : undefined
            }
            transition={
              exiting
                ? { duration: EXIT_DURATION, delay: exitDelay, ease: "easeOut" }
                : {
                    duration: 0.5,
                    delay: index * SCREEN_STAGGER,
                    ease: "easeOut",
                  }
            }
            src={screen}
            alt=""
            className="h-auto w-full rounded-2xl drop-shadow-md"
          />
        ))}
      </div>
    </>
  );
}
