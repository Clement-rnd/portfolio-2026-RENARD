import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  LeftToRightListBulletIcon,
  TextAlignLeftIcon,
} from "@hugeicons/core-free-icons";
import { Squircle } from "./Squircle";

// The active pill matches the project tags' corner radius (see
// ProjectCard's Squircle); the outer track is a bit more to compare the look.
const TRACK_CORNER_RADIUS = 10;
const PILL_CORNER_RADIUS = 8;

export type AboutViewMode = "story" | "tldr";

const SEGMENTS: { value: AboutViewMode; label: string; icon: IconSvgElement }[] = [
  { value: "story", label: "Story", icon: TextAlignLeftIcon },
  { value: "tldr", label: "TL;DR", icon: LeftToRightListBulletIcon },
];

export interface SegmentedControlProps {
  value: AboutViewMode;
  onChange: (value: AboutViewMode) => void;
  className?: string;
}

export function SegmentedControl({
  value,
  onChange,
  className = "",
}: SegmentedControlProps) {
  return (
    <Squircle
      cornerRadius={TRACK_CORNER_RADIUS}
      cornerSmoothing={1}
      fill="var(--color-neutral-100)"
      borderWidth={0}
      className={`inline-flex ${className}`}
    >
      <div className="flex items-center gap-1 p-1">
        {SEGMENTS.map((segment) => {
          const isActive = value === segment.value;
          return (
            <button
              key={segment.value}
              type="button"
              onClick={() => onChange(segment.value)}
              className={`relative flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium leading-none transition-colors ${
                isActive ? "text-heading" : "text-neutral-400"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="about-segmented-control-bg"
                  className="absolute inset-0"
                  transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
                >
                  <Squircle
                    cornerRadius={PILL_CORNER_RADIUS}
                    cornerSmoothing={1}
                    fill="white"
                    borderWidth={0}
                    className="h-full w-full drop-shadow-sm"
                  />
                </motion.div>
              )}
              <span className="relative flex items-center gap-1.5">
                <HugeiconsIcon icon={segment.icon} size={16} />
                {segment.label}
              </span>
            </button>
          );
        })}
      </div>
    </Squircle>
  );
}
