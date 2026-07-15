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

// Same branch markup (category pill -> items with a vertical guide line ->
// children) reused for both breakpoints — only the outer container changes
// from a single vertical column (mobile) to a horizontal row of columns
// (desktop, one per category). The pill, the line, and every item share one
// `isInView` trigger (instead of each independently entering the viewport)
// so the cascade reads as "category appears, then its items one by one"
// rather than several near-simultaneous triggers.
function CategoryBranch({ category }: { category: SitemapCategory }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const lineDuration = category.items.length * ITEM_STAGGER + ITEM_DURATION;

  return (
    <div ref={ref} className="flex flex-col gap-3">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.5, ease: "easeOut" }}
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
          transition={{ duration: lineDuration, ease: "easeOut" }}
        />
        {category.items.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : undefined}
            transition={{
              duration: ITEM_DURATION,
              delay: index * ITEM_STAGGER,
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
              <div className="ml-2 flex flex-col gap-1 border-l border-neutral-100 pl-4">
                {item.children.map((child) => (
                  <span
                    key={child}
                    className="flex items-center gap-1.5 text-sm text-body whitespace-nowrap"
                  >
                    <HugeiconsIcon
                      icon={CornerDownRightIcon}
                      size={14}
                      className="shrink-0"
                    />
                    {child}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function SitemapTree({ categories }: SitemapTreeProps) {
  return (
    <>
      {/* Mobile: categories stacked top to bottom. */}
      <div className="flex flex-col gap-8 md:hidden">
        {categories.map((category) => (
          <CategoryBranch key={category.label} category={category} />
        ))}
      </div>

      {/* Desktop: same branch, laid out left to right instead. */}
      <div className="hidden items-start gap-10 overflow-x-auto pb-4 md:flex">
        {categories.map((category) => (
          <div key={category.label} className="shrink-0">
            <CategoryBranch category={category} />
          </div>
        ))}
      </div>
    </>
  );
}
