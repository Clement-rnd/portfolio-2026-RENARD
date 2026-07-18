import { useLayoutEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  ArrowExpand02Icon,
  Atom02Icon,
  Diamond02Icon,
  Files02Icon,
  Flag03Icon,
  FolderOpenIcon,
  GridViewIcon,
  HexagonIcon,
  HierarchySquare01Icon,
  Idea01Icon,
  Image02Icon,
  PaintBoardIcon,
  PuzzleIcon,
  SmartPhone01Icon,
  TextFontIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { Squircle } from "./Squircle";

interface FileTreeItem {
  label: string;
  icon: IconSvgElement;
  children?: { label: string; icon: IconSvgElement }[];
}

interface FileTreeCategory {
  label: string;
  items: FileTreeItem[];
}

// Mirrors the Figma file's own organization (Design system / Librairie /
// Projet pages), shown as a static reference diagram — not project data.
const CATEGORIES: FileTreeCategory[] = [
  {
    label: "Design system",
    items: [
      { label: "Documentation", icon: Files02Icon },
      {
        label: "Fondations",
        icon: Atom02Icon,
        children: [
          { label: "Couleurs", icon: PaintBoardIcon },
          { label: "Typographies", icon: TextFontIcon },
          { label: "Espaces", icon: ArrowExpand02Icon },
          { label: "Grilles", icon: GridViewIcon },
          { label: "Tokens", icon: HexagonIcon },
        ],
      },
      { label: "Composants", icon: PuzzleIcon },
      { label: "Composants natifs", icon: PuzzleIcon },
    ],
  },
  {
    label: "Librairie",
    items: [
      { label: "Icones", icon: Image02Icon },
      { label: "Logos", icon: Diamond02Icon },
      { label: "Drapeaux", icon: Flag03Icon },
      { label: "Avatars", icon: UserIcon },
    ],
  },
  {
    label: "Projet",
    items: [
      { label: "Sitemap", icon: HierarchySquare01Icon },
      { label: "Wireframes", icon: SmartPhone01Icon },
      { label: "Inspirations", icon: Idea01Icon },
    ],
  },
];

const ITEM_STAGGER = 0.12;
const ITEM_DURATION = 0.4;
const BLOCK_STAGGER = 0.2;

// Same tree markup reused for both breakpoints — only the outer container
// changes from a stacked column (mobile) to a row of columns (desktop). On
// desktop all columns share one trigger but cascade left to right; on
// mobile each column watches its own viewport entry.
function CategoryBranch({
  category,
  isInView: isInViewOverride,
  delay = 0,
}: {
  category: FileTreeCategory;
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

  let itemIndex = 0;

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
              icon={FolderOpenIcon}
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
        {category.items.map((item) => {
          const currentIndex = itemIndex;
          itemIndex += 1 + (item.children?.length ?? 0);
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: ITEM_DURATION,
                delay: delay + currentIndex * ITEM_STAGGER,
                ease: "easeOut",
              }}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={item.icon}
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
                  {item.children.map((child, childOffset) => (
                    <motion.span
                      key={child.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={isInView ? { opacity: 1, y: 0 } : undefined}
                      transition={{
                        duration: ITEM_DURATION,
                        delay:
                          delay +
                          (currentIndex + 1 + childOffset) * ITEM_STAGGER,
                        ease: "easeOut",
                      }}
                      className="flex items-center gap-1.5 text-sm text-body whitespace-nowrap"
                    >
                      <HugeiconsIcon
                        icon={child.icon}
                        size={14}
                        className="shrink-0"
                      />
                      {child.label}
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

// Always kept as one horizontal row (never stacked, even on mobile) — the
// whole row is uniformly scaled down (via CSS transform) to fit whatever
// width is actually available, rather than wrapping or horizontally
// scrolling. `inner.scrollWidth`/`scrollHeight` are layout-box
// measurements, unaffected by the transform, so they stay a reliable
// "natural size" regardless of the row's current scale.
export function FigmaFileTree() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(innerRef, { once: true, amount: 0.2 });
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    function measure() {
      if (!outer || !inner) return;
      const naturalWidth = inner.scrollWidth;
      const naturalHeight = inner.scrollHeight;
      const nextScale =
        naturalWidth > 0 ? Math.min(1, outer.clientWidth / naturalWidth) : 1;
      setScale(nextScale);
      outer.style.height = `${naturalHeight * nextScale}px`;
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={outerRef} className="overflow-hidden">
      <div
        ref={innerRef}
        className="flex w-max justify-between gap-6 md:w-full"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {CATEGORIES.map((category, index) => (
          <div key={category.label} className="shrink-0">
            <CategoryBranch
              category={category}
              isInView={isInView}
              delay={index * BLOCK_STAGGER}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
