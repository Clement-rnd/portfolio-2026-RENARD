import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import {
  FlimSlateIcon,
  MessageQuestionIcon,
  PinIcon,
  Refresh01Icon,
  Tap06Icon,
} from "@hugeicons/core-free-icons";
import { DotSeparator } from "./DotSeparator";
import { Squircle } from "./Squircle";
import { EXIT_DISTANCE, EXIT_DURATION } from "../lib/exitTransition";

interface ProtocolStep {
  icon: IconSvgElement;
  title: string;
  items: string[];
}

const STEPS: ProtocolStep[] = [
  {
    icon: PinIcon,
    title: "Introduction",
    items: [
      "Explication du contexte",
      "Mise à disposition du matériel",
      "Explication du déroulement",
    ],
  },
  {
    icon: FlimSlateIcon,
    title: "Scénario",
    items: ["Mise en situation"],
  },
  {
    icon: Tap06Icon,
    title: "Manipulation",
    items: [
      "Observation de l'utilisateur",
      "Identification des réactions",
      "Prise de note des verbatimes",
    ],
  },
  {
    icon: MessageQuestionIcon,
    title: "Questions",
    items: ["Recherche de précisions", "Prise de note"],
  },
  {
    // Placeholder icon — swap for the real one once given.
    icon: Refresh01Icon,
    title: "Itérations",
    items: ["Ajuster l'application en fonction des retours."],
  },
];

const STEP_STAGGER = 0.15;
const STEP_DURATION = 0.5;

function StepCard({ step }: { step: ProtocolStep }) {
  return (
    <Squircle
      cornerRadius={16}
      cornerSmoothing={1}
      borderColor="#F0EFEF"
      fill="#FCFCFC"
      className="w-full"
    >
      <div className="flex flex-col gap-4 p-6">
        <h3 className="font-casta text-xl font-medium text-heading">
          {step.title}
        </h3>
        <ul className="flex flex-col gap-1.5">
          {step.items.map((item) => (
            <li
              key={item}
              className="flex items-baseline gap-2 text-base text-body"
            >
              <span className="text-body">
                <DotSeparator />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Squircle>
  );
}

// One row of the desktop timeline: a card on one side, a short horizontal
// stub connecting it to the central spine, and a dot sitting on the spine.
// Both side columns are equal `1fr` tracks, so the dot column always lands
// exactly on the container's horizontal center regardless of card width —
// which is also where the absolute spine line is drawn.
interface RevealProps {
  initial: { opacity: number; y: number };
  animate: { opacity: number; y: number } | undefined;
  transition: { duration: number; delay: number; ease: "easeOut" };
}

function TimelineRow({
  step,
  index,
  isLeft,
  exiting,
  exitDelay,
  onReveal,
}: {
  step: ProtocolStep;
  index: number;
  isLeft: boolean;
  exiting: boolean;
  exitDelay: number;
  onReveal: (index: number) => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) onReveal(index);
  }, [isInView, index, onReveal]);

  const reveal: RevealProps = {
    initial: { opacity: 0, y: 24 },
    animate: exiting
      ? { opacity: 0, y: -EXIT_DISTANCE }
      : isInView
        ? { opacity: 1, y: 0 }
        : undefined,
    transition: exiting
      ? { duration: EXIT_DURATION, delay: exitDelay, ease: "easeOut" }
      : { duration: STEP_DURATION, delay: index * STEP_STAGGER, ease: "easeOut" },
  };

  return (
    <div ref={ref} className="grid grid-cols-[1fr_auto_1fr] items-center gap-0">
      <div className="flex items-center justify-end">
        {isLeft && (
          <>
            <motion.div {...reveal} className="w-fit max-w-md">
              <StepCard step={step} />
            </motion.div>
            <motion.div
              {...reveal}
              className="h-1 w-6 shrink-0 rounded-full bg-neutral-200"
            />
          </>
        )}
      </div>
      <motion.span
        {...reveal}
        className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
      >
        <HugeiconsIcon icon={step.icon} size={14} className="text-heading" />
      </motion.span>
      <div className="flex items-center justify-start">
        {!isLeft && (
          <>
            <motion.div
              {...reveal}
              className="h-1 w-6 shrink-0 rounded-full bg-neutral-200"
            />
            <motion.div {...reveal} className="w-fit max-w-md">
              <StepCard step={step} />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

// Mobile row: a checkmark dot plus title/items, matching the "process"
// section's timeline pattern exactly (same dot style, same shared growing
// line, own viewport trigger reporting back so the line's fill tracks how
// many steps have actually revealed).
function MobileStepRow({
  step,
  index,
  exiting,
  exitDelay,
  onReveal,
}: {
  step: ProtocolStep;
  index: number;
  exiting: boolean;
  exitDelay: number;
  onReveal: (index: number) => void;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const delay = index * STEP_STAGGER;

  useEffect(() => {
    if (isInView) onReveal(index);
  }, [isInView, index, onReveal]);

  const rowTransition = exiting
    ? { duration: EXIT_DURATION, delay: exitDelay, ease: "easeOut" as const }
    : { duration: STEP_DURATION, delay, ease: "easeOut" as const };
  const rowAnimate = exiting
    ? { opacity: 0, y: -EXIT_DISTANCE }
    : isInView
      ? { opacity: 1, y: 0 }
      : undefined;

  return (
    <div ref={ref} className="relative flex gap-2">
      <motion.span
        className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white drop-shadow-md"
        initial={{ opacity: 0, y: 40 }}
        animate={rowAnimate}
        transition={rowTransition}
      >
        <HugeiconsIcon icon={step.icon} size={14} className="text-heading" />
      </motion.span>
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 40 }}
        animate={rowAnimate}
        transition={rowTransition}
      >
        <h3 className="font-casta text-xl font-bold leading-tight text-heading">
          {step.title}
        </h3>
        <ul className="flex flex-col gap-1.5">
          {step.items.map((item) => (
            <li
              key={item}
              className="flex items-baseline gap-2 text-lg font-medium text-body"
            >
              <span className="h-1 w-1 shrink-0 translate-y-[-3px] rounded-full bg-body" />
              {item}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export interface TestProtocolTimelineProps {
  exiting?: boolean;
  exitDelay?: number;
}

export function TestProtocolTimeline({
  exiting = false,
  exitDelay = 0,
}: TestProtocolTimelineProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const handleReveal = useCallback((index: number) => {
    setRevealedCount((prev) => Math.max(prev, index + 1));
  }, []);
  const [desktopRevealedCount, setDesktopRevealedCount] = useState(0);
  const handleDesktopReveal = useCallback((index: number) => {
    setDesktopRevealedCount((prev) => Math.max(prev, index + 1));
  }, []);

  return (
    <div>
      {/* Mobile: same checkmark-timeline pattern as the "process" section —
          a shared vertical line growing behind the rows as each one
          reveals. */}
      <div className="relative flex flex-col gap-12 md:hidden">
        <motion.div
          className="absolute top-2 bottom-2 left-[10px] w-1 origin-top rounded-full bg-neutral-200"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: exiting ? 0 : revealedCount / STEPS.length }}
          transition={
            exiting
              ? { duration: EXIT_DURATION, delay: exitDelay, ease: "easeOut" }
              : { duration: STEP_DURATION, ease: "easeOut" }
          }
        />
        {STEPS.map((step, index) => (
          <MobileStepRow
            key={step.title}
            step={step}
            index={index}
            exiting={exiting}
            exitDelay={exitDelay}
            onReveal={handleReveal}
          />
        ))}
      </div>

      {/* Desktop: a single central vertical spine with alternating
          left/right cards, each connected to the spine by a short stub and
          a dot — matches a classic alternating vertical timeline layout. */}
      <div className="relative hidden md:mt-12 md:mb-12 md:flex md:flex-col md:gap-0">
        <motion.div
          className="absolute top-0 bottom-0 left-1/2 w-1 origin-top -translate-x-1/2 rounded-full bg-neutral-200"
          initial={{ scaleY: 0 }}
          animate={{
            scaleY: exiting ? 0 : desktopRevealedCount / STEPS.length,
          }}
          transition={
            exiting
              ? { duration: EXIT_DURATION, delay: exitDelay, ease: "easeOut" }
              : { duration: STEP_DURATION, ease: "easeOut" }
          }
        />
        {STEPS.map((step, index) => (
          <TimelineRow
            key={step.title}
            step={step}
            index={index}
            isLeft={index % 2 === 0}
            exiting={exiting}
            exitDelay={exitDelay}
            onReveal={handleDesktopReveal}
          />
        ))}
      </div>
    </div>
  );
}
