import { useCallback, useRef, useState } from "react";
import type { TargetUserPersona } from "../data/projects";
import { TargetUserCard } from "./TargetUserCard";

export interface TargetUserCarouselProps {
  personas: TargetUserPersona[];
}

export function TargetUserCarousel({ personas }: TargetUserCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

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
      <div className="flex flex-col gap-6 md:hidden">
        <div
          ref={scrollRef}
          onScroll={updateActiveIndex}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {personas.map((persona, index) => (
            <div
              key={persona.title}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="w-full shrink-0 snap-center"
            >
              <TargetUserCard
                title={persona.title}
                context={persona.context}
                needs={persona.needs}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2">
          {personas.map((persona, index) => (
            <button
              key={persona.title}
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
                index === activeIndex
                  ? "w-6 bg-heading"
                  : "w-2 bg-neutral-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: plain 2x2 grid, no carousel/dots. */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-6">
        {personas.map((persona) => (
          <TargetUserCard
            key={persona.title}
            title={persona.title}
            context={persona.context}
            needs={persona.needs}
          />
        ))}
      </div>
    </>
  );
}
