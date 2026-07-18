import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ChevronRightIcon,
  CornerDownRightIcon,
  File01Icon,
} from "@hugeicons/core-free-icons";
import type { SitemapCategory } from "../data/projects";
import { Squircle } from "./Squircle";

export interface SitemapTreeProps {
  categories: SitemapCategory[];
}

const ITEM_STAGGER = 0.12;
const ITEM_DURATION = 0.4;
const BLOCK_STAGGER = 0.2;

// Same branch markup (category pill -> items with a vertical guide line ->
// children) reused for both breakpoints — only the outer container changes
// from a single vertical column (mobile) to a horizontal row of columns
// (desktop, one per category). The pill, the line, and every item share one
// `isInView` trigger (instead of each independently entering the viewport)
// so the cascade reads as "category appears, then its items one by one"
// rather than several near-simultaneous triggers. On desktop `isInView` and
// `delay` are passed down from the row so every column shares one trigger
// but starts its own cascade block by block, left to right; on mobile each
// branch still watches its own viewport entry (delay stays 0).
function CategoryBranch({
  category,
  isInView: isInViewOverride,
  delay = 0,
}: {
  category: SitemapCategory;
  isInView?: boolean;
  delay?: number;
}) {
  const ref = useRef(null);
  const ownIsInView = useInView(ref, { once: true, amount: 0.3 });
  const isInView = isInViewOverride ?? ownIsInView;
  const itemCount = category.items.reduce(
    (sum, item) => sum + 1 + (item.children?.length ?? 0),
    0,
  );
  const lineDuration = itemCount * ITEM_STAGGER + ITEM_DURATION;

  return (
    <div ref={ref} className="flex flex-col gap-3">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, delay, ease: "easeOut" }}
        className="w-fit"
      >
        <Squircle
          cornerRadius={8}
          cornerSmoothing={1}
          fill="#FCFCFC"
          borderWidth={0}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2">
            <HugeiconsIcon
              icon={File01Icon}
              size={18}
              className="text-heading"
            />
            <span className="text-base font-semibold text-heading whitespace-nowrap">
              {category.label}
            </span>
          </div>
        </Squircle>
      </motion.div>
      <div className="relative ml-4 flex flex-col gap-3 pl-4">
        <motion.div
          className="absolute top-0 bottom-0 left-0 w-px origin-top bg-neutral-200"
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : undefined}
          transition={{ duration: lineDuration, delay, ease: "easeOut" }}
        />
        {category.items.map((item, index) => {
          // Each nested child continues the same stagger sequence right
          // after its parent item, rather than popping in together with it.
          const itemDelay = delay + index * ITEM_STAGGER;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: ITEM_DURATION,
                delay: itemDelay,
                ease: "easeOut",
              }}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={ChevronRightIcon}
                  size={16}
                  className="shrink-0 text-body"
                />
                <span className="text-sm font-medium text-heading whitespace-nowrap">
                  {item.label}
                </span>
              </div>
              {item.children && item.children.length > 0 && (
                <div className="relative ml-2 flex flex-col gap-1 pl-4">
                  <div className="absolute top-0 bottom-0 left-0 w-px bg-neutral-200" />
                  {item.children.map((child, childIndex) => (
                    <motion.span
                      key={child}
                      initial={{ opacity: 0, y: 16 }}
                      animate={isInView ? { opacity: 1, y: 0 } : undefined}
                      transition={{
                        duration: ITEM_DURATION,
                        delay: itemDelay + (childIndex + 1) * ITEM_STAGGER,
                        ease: "easeOut",
                      }}
                      className="flex items-center gap-1.5 text-sm text-body whitespace-nowrap"
                    >
                      <HugeiconsIcon
                        icon={CornerDownRightIcon}
                        size={14}
                        className="shrink-0"
                      />
                      {child}
                    </motion.span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function SitemapTree({ categories }: SitemapTreeProps) {
  const desktopRef = useRef(null);
  const isDesktopInView = useInView(desktopRef, { once: true, amount: 0.2 });

  return (
    <>
      {/* Mobile: categories stacked top to bottom. */}
      <div className="flex flex-col gap-8 md:hidden">
        {categories.map((category) => (
          <CategoryBranch key={category.label} category={category} />
        ))}
      </div>

      {/* Desktop: same branch, laid out left to right instead, spread
          across the full width rather than clustered on the left. All
          columns share one trigger but cascade left to right. Wraps to
          the next line (rather than squeezing/clipping) once there's no
          longer room for every column on one row, e.g. on tablet. */}
      <div
        ref={desktopRef}
        className="hidden flex-wrap items-start gap-10 md:flex"
      >
        {categories.map((category, index) => (
          <div key={category.label} className="min-w-56 flex-1">
            <CategoryBranch
              category={category}
              isInView={isDesktopInView}
              delay={index * BLOCK_STAGGER}
            />
          </div>
        ))}
      </div>
    </>
  );
}
