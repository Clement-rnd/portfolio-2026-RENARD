import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick01Icon } from "@hugeicons/core-free-icons";
import type { ProcessStep } from "../data/process";
import { EXIT_DISTANCE, EXIT_DURATION } from "../lib/exitTransition";

export interface ProcessTimelineProps {
  steps: ProcessStep[];
  exiting?: boolean;
  exitDelay?: number;
}

const STEP_STAGGER = 0.1;
const STEP_DURATION = 0.5;

interface ProcessStepRowProps {
  step: ProcessStep;
  index: number;
  exiting: boolean;
  exitDelay: number;
  onReveal: (index: number) => void;
}

// Its own trigger (not raw scroll position) drives this row's reveal, and
// reports back so the single shared line (rendered once by the parent, so
// there's no seam between segments) knows how far to grow.
function ProcessStepRow({
  step,
  index,
  exiting,
  exitDelay,
  onReveal,
}: ProcessStepRowProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const delay = index * STEP_STAGGER;

  useEffect(() => {
    if (isInView) onReveal(index);
  }, [isInView, index, onReveal]);

  return (
    <div ref={ref} className="relative flex gap-2">
      <motion.span
        className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white drop-shadow-md"
        initial={{ opacity: 0, y: 40 }}
        animate={
          exiting
            ? { opacity: 0, y: -EXIT_DISTANCE }
            : isInView
              ? { opacity: 1, y: 0 }
              : undefined
        }
        transition={
          exiting
            ? { duration: EXIT_DURATION, delay: exitDelay, ease: "easeOut" }
            : { duration: STEP_DURATION, delay, ease: "easeOut" }
        }
      >
        <HugeiconsIcon icon={Tick01Icon} size={14} className="text-heading" />
      </motion.span>
      <motion.div
        className="flex flex-col gap-2"
        initial={{ opacity: 0, y: 40 }}
        animate={
          exiting
            ? { opacity: 0, y: -EXIT_DISTANCE }
            : isInView
              ? { opacity: 1, y: 0 }
              : undefined
        }
        transition={
          exiting
            ? { duration: EXIT_DURATION, delay: exitDelay, ease: "easeOut" }
            : { duration: STEP_DURATION, delay, ease: "easeOut" }
        }
      >
        <h3 className="font-casta text-xl font-bold leading-tight text-heading">
          {step.title}
        </h3>
        <p className="text-lg font-medium text-body">{step.description}</p>
      </motion.div>
    </div>
  );
}

export function ProcessTimeline({
  steps,
  exiting = false,
  exitDelay = 0,
}: ProcessTimelineProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const handleReveal = useCallback((index: number) => {
    setRevealedCount((prev) => Math.max(prev, index + 1));
  }, []);

  return (
    <div className="relative flex flex-col gap-12">
      <motion.div
        className="absolute top-2 bottom-2 left-[10px] w-1 origin-top rounded-full bg-neutral-200"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: exiting ? 0 : revealedCount / steps.length }}
        transition={
          exiting
            ? { duration: EXIT_DURATION, delay: exitDelay, ease: "easeOut" }
            : { duration: STEP_DURATION, ease: "easeOut" }
        }
      />
      {steps.map((step, index) => (
        <ProcessStepRow
          key={step.number}
          step={step}
          index={index}
          exiting={exiting}
          exitDelay={exitDelay}
          onReveal={handleReveal}
        />
      ))}
    </div>
  );
}
