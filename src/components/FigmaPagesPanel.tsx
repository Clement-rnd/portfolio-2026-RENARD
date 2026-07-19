import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  CornerDownRightIcon,
  Flag03Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { EXIT_DISTANCE, EXIT_DURATION } from "../lib/exitTransition";

type PageEntry = { label: string; children?: string[] };

// Mirrors the Figma file's own "Pages" panel — a static reference diagram,
// not project data.
const PAGE_GROUPS: PageEntry[][] = [
  [{ label: "COVER" }, { label: "READ ME" }, { label: "BRIEF" }, { label: "SITEMAP" }],
  [
    { label: "FLOW - Onboarding", children: ["Wireframes"] },
    { label: "FLOW - HOME", children: ["Wireframes"] },
    { label: "FLOW - HEALTH", children: ["Wireframes", "Version history"] },
    { label: "RESPONSIVE" },
  ],
  [{ label: "INSPIRATIONS" }, { label: "PLAYGROUND" }],
  [{ label: "BRANDING" }, { label: "COMPONENTS" }],
];

const ITEM_STAGGER = 0.04;
const ITEM_DURATION = 0.4;

export interface FigmaPagesPanelProps {
  exiting?: boolean;
  exitDelay?: number;
}

export function FigmaPagesPanel({
  exiting = false,
  exitDelay = 0,
}: FigmaPagesPanelProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  let rowIndex = 0;

  return (
    <div
      ref={ref}
      className="w-full rounded-2xl bg-[#2C2C2C] px-5 py-6 md:w-72 md:shrink-0"
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Pages</span>
        <div className="flex items-center gap-3 text-neutral-400">
          <HugeiconsIcon icon={Search01Icon} size={16} />
          <HugeiconsIcon icon={Add01Icon} size={16} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {PAGE_GROUPS.map((group, groupIndex) => (
          <div key={groupIndex} className="flex flex-col gap-3">
            {group.map((page) => {
              const currentIndex = rowIndex;
              rowIndex += 1 + (page.children?.length ?? 0);
              return (
                <div key={page.label} className="flex flex-col gap-2">
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={
                      exiting
                        ? { opacity: 0, y: -EXIT_DISTANCE }
                        : isInView
                          ? { opacity: 1, x: 0 }
                          : undefined
                    }
                    transition={
                      exiting
                        ? {
                            duration: EXIT_DURATION,
                            delay: exitDelay,
                            ease: "easeOut",
                          }
                        : {
                            duration: ITEM_DURATION,
                            delay: currentIndex * ITEM_STAGGER,
                            ease: "easeOut",
                          }
                    }
                    className="flex items-center gap-2"
                  >
                    <HugeiconsIcon
                      icon={Flag03Icon}
                      size={13}
                      className="shrink-0 text-neutral-400"
                    />
                    <span className="text-[13px] text-neutral-200">
                      {page.label}
                    </span>
                  </motion.div>
                  {page.children?.map((child, childOffset) => (
                    <motion.div
                      key={child}
                      initial={{ opacity: 0, x: -12 }}
                      animate={
                        exiting
                          ? { opacity: 0, y: -EXIT_DISTANCE }
                          : isInView
                            ? { opacity: 1, x: 0 }
                            : undefined
                      }
                      transition={
                        exiting
                          ? {
                              duration: EXIT_DURATION,
                              delay: exitDelay,
                              ease: "easeOut",
                            }
                          : {
                              duration: ITEM_DURATION,
                              delay:
                                (currentIndex + 1 + childOffset) *
                                ITEM_STAGGER,
                              ease: "easeOut",
                            }
                      }
                      className="flex items-center gap-1.5 pl-4"
                    >
                      <HugeiconsIcon
                        icon={CornerDownRightIcon}
                        size={13}
                        className="shrink-0 text-neutral-500"
                      />
                      <span className="text-[13px] text-neutral-400">
                        {child}
                      </span>
                    </motion.div>
                  ))}
                </div>
              );
            })}
            {groupIndex < PAGE_GROUPS.length - 1 && (
              <div className="mt-1 border-t border-neutral-700" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
