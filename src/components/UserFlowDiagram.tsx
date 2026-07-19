import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { EXIT_DISTANCE, EXIT_DURATION } from "../lib/exitTransition";

export interface UserFlowDiagramProps {
  exiting?: boolean;
  exitDelay?: number;
}

// Recreates the "Health" user-flow diagram from the Figma file (start node,
// decision, screens and actions) as a static reference diagram, not project
// data — colors mirror Figma's own node-type legend (green start, yellow
// decision, blue screens, purple actions).

function StartNode({ label }: { label: string }) {
  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-emerald-400 bg-emerald-100 px-2 text-center text-xs font-medium text-emerald-900">
      {label}
    </div>
  );
}

function DecisionNode({ label }: { label: string }) {
  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
      <div className="absolute inset-2 rotate-45 rounded-md border border-amber-400 bg-amber-100" />
      <span className="relative z-10 max-w-[76px] text-center text-xs font-medium text-amber-900">
        {label}
      </span>
    </div>
  );
}

function ScreenNode({ label }: { label: string }) {
  return (
    <div className="flex min-w-[130px] shrink-0 items-center justify-center rounded-md border border-sky-400 bg-sky-100 px-4 py-3 text-center text-xs font-medium text-sky-900">
      {label}
    </div>
  );
}

function ActionNode({ label }: { label: string }) {
  return (
    <div className="relative shrink-0">
      <div className="absolute inset-0 -skew-x-12 rounded-md border border-violet-400 bg-violet-100" />
      <span className="relative z-10 flex min-w-[130px] items-center justify-center px-5 py-3 text-center text-xs font-medium text-violet-900">
        {label}
      </span>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex shrink-0 items-center">
      <div className="h-px w-4 bg-neutral-300 md:w-6" />
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={14}
        className="-ml-1 shrink-0 text-neutral-400"
      />
    </div>
  );
}

// Draws the fork/merge point where one line splits into (or two lines
// converge from) the two branch rows — mirrors the elbow connectors in the
// reference diagram instead of two disconnected straight arrows.
function Fan() {
  return (
    <div className="relative h-28 w-6 shrink-0">
      <div className="absolute top-1/4 bottom-1/4 left-1/2 w-px -translate-x-1/2 bg-neutral-300" />
      <div className="absolute top-1/4 left-1/2 h-px w-1/2 -translate-y-1/2 bg-neutral-300" />
      <div className="absolute bottom-1/4 left-1/2 h-px w-1/2 -translate-y-1/2 bg-neutral-300" />
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={14}
        className="absolute top-1/4 right-0 -translate-y-1/2 translate-x-1/2 text-neutral-400"
      />
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={14}
        className="absolute bottom-1/4 right-0 translate-x-1/2 translate-y-1/2 text-neutral-400"
      />
    </div>
  );
}

function Branch({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-3">{children}</div>;
}

export function UserFlowDiagram({
  exiting = false,
  exitDelay = 0,
}: UserFlowDiagramProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Same scale-to-fit approach as FigmaFileTree: the diagram is laid out at
  // its natural size, then uniformly scaled down via CSS transform so it
  // always fits the available width — no horizontal scrollbar, regardless
  // of viewport size.
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

  const reveal = {
    initial: { opacity: 0, y: 32 },
    animate: exiting
      ? { opacity: 0, y: -EXIT_DISTANCE }
      : isInView
        ? { opacity: 1, y: 0 }
        : undefined,
    transition: exiting
      ? ({ duration: EXIT_DURATION, delay: exitDelay, ease: "easeOut" } as const)
      : ({ duration: 0.6, ease: "easeOut" } as const),
  };

  return (
    <motion.div
      ref={ref}
      {...reveal}
      className="w-full overflow-hidden rounded-2xl border border-neutral-100 bg-white p-6"
    >
      <div ref={outerRef} className="overflow-hidden">
        <div
          ref={innerRef}
          className="flex w-max items-center gap-3"
          style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
        >
        <StartNode label="Health" />
        <Connector />
        <DecisionNode label="Does the user have any animals added?" />
        <Fan />

        <div className="flex flex-col gap-4">
          <Branch>
            <ScreenNode label="List of my animals" />
            <Connector />
            <ActionNode label="Select animal" />
            <div className="invisible flex items-center gap-3">
              <Connector />
              <ActionNode label="Add an animal flow" />
            </div>
          </Branch>
          <Branch>
            <ScreenNode label="My animal list is empty" />
            <Connector />
            <ActionNode label="Add animal" />
            <Connector />
            <ActionNode label="Add an animal flow" />
          </Branch>
        </div>

        <Fan />
        <ScreenNode label="Animal record" />
        </div>
      </div>
    </motion.div>
  );
}
