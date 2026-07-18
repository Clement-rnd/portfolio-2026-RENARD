import { useCallback, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { EXIT_DISTANCE, EXIT_DURATION } from "../lib/exitTransition";
import { KeyDecisionCard } from "./KeyDecisionCard";

export interface KeyDecisionsCarouselProps {
  decisions: { title: string; description: string }[];
  exiting?: boolean;
  exitDelay?: number;
}

const CARD_STAGGER = 0.1;

export function KeyDecisionsCarousel({
  decisions,
  exiting = false,
  exitDelay = 0,
}: KeyDecisionsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const gridRef = useRef(null);
  const isGridInView = useInView(gridRef, { once: true, amount: 0.2 });
  const mobileRef = useRef(null);
  const isMobileInView = useInView(mobileRef, { once: true, amount: 0.2 });

  const updateActiveIndex = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - containerCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    setActiveIndex(closestIndex);
  }, []);

  return (
    <>
      {/* Mobile: full-width swipeable carousel with pagination dots. */}
      <motion.div
        ref={mobileRef}
        initial={{ opacity: 0, y: 40 }}
        animate={
          exiting
            ? { opacity: 0, y: -EXIT_DISTANCE }
            : isMobileInView
              ? { opacity: 1, y: 0 }
              : undefined
        }
        transition={
          exiting
            ? { duration: EXIT_DURATION, delay: exitDelay, ease: "easeOut" }
            : { duration: 0.5, ease: "easeOut" }
        }
        className="flex flex-col gap-6 md:hidden"
      >
        <div
          ref={scrollRef}
          onScroll={updateActiveIndex}
          className="-mx-4 flex snap-x snap-mandatory overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {decisions.map((decision, index) => (
            <div
              key={decision.title}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="w-screen shrink-0 snap-center px-4"
            >
              <KeyDecisionCard
                title={decision.title}
                description={decision.description}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2">
          {decisions.map((decision, index) => (
            <button
              key={decision.title}
              type="button"
              onClick={() =>
                cardRefs.current[index]?.scrollIntoView({
                  behavior: "smooth",
                  inline: "center",
                  block: "nearest",
                })
              }
              aria-label={`Aller à la card ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? "w-6 bg-heading" : "w-2 bg-neutral-200"
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* Desktop: plain 3-column grid, no carousel/dots, each card revealed
          individually rather than the whole grid at once. */}
      <div ref={gridRef} className="hidden md:grid md:grid-cols-3 md:gap-6">
        {decisions.map((decision, index) => (
          <motion.div
            key={decision.title}
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
                    delay: index * CARD_STAGGER,
                    ease: "easeOut",
                  }
            }
          >
            <KeyDecisionCard
              title={decision.title}
              description={decision.description}
            />
          </motion.div>
        ))}
      </div>
    </>
  );
}
