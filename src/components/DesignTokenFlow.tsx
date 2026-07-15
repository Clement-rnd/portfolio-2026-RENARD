import { useLayoutEffect, useRef, useState } from "react";
import type {
  DesignToken,
  DesignTokenFlow as DesignTokenFlowData,
} from "../data/projects";
import { Squircle } from "./Squircle";

export interface DesignTokenFlowProps {
  flow: DesignTokenFlowData;
}

const TIER_LABEL_CLASSNAME = "text-sm font-medium text-body";

function TokenPill({
  token,
  pillRef,
}: {
  token: DesignToken;
  pillRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={pillRef} className="w-fit">
      <Squircle
        cornerRadius={8}
        cornerSmoothing={1}
        borderColor="#F0EFEF"
        fill="#FCFCFC"
      >
        <div className="flex items-center gap-2 px-3 py-2">
          <span
            className="h-4 w-4 shrink-0 rounded"
            style={{ backgroundColor: token.color }}
          />
          <span className="text-sm font-medium text-heading whitespace-nowrap">
            {token.name}
          </span>
          {token.reference && (
            <span className="text-sm text-body whitespace-nowrap">
              {token.reference}
            </span>
          )}
        </div>
      </Squircle>
    </div>
  );
}

interface Connection {
  from: string;
  to: string;
}

// Desktop: primitives fan out into semantic tokens, and whichever semantic
// token a component token references fans out into that component token —
// each connector is a real bezier curve computed from the pills' actual
// rendered positions (they're laid out by flexbox, not fixed coordinates),
// re-measured whenever the flow data or viewport size changes.
function DesignTokenFlowDesktop({ flow }: DesignTokenFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef(new Map<string, HTMLDivElement>());
  const [paths, setPaths] = useState<string[]>([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function measure() {
      if (!container) return;
      const containerRect = container.getBoundingClientRect();

      function centerRight(name: string) {
        const el = pillRefs.current.get(name);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: r.right - containerRect.left,
          y: r.top + r.height / 2 - containerRect.top,
        };
      }
      function centerLeft(name: string) {
        const el = pillRefs.current.get(name);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: r.left - containerRect.left,
          y: r.top + r.height / 2 - containerRect.top,
        };
      }

      const connections: Connection[] = [];
      for (let i = 1; i < flow.primitives.length; i++) {
        connections.push({
          from: flow.primitives[i - 1].name,
          to: flow.primitives[i].name,
        });
      }
      const lastPrimitive = flow.primitives[flow.primitives.length - 1];
      if (lastPrimitive) {
        flow.semantic.forEach((token) =>
          connections.push({ from: lastPrimitive.name, to: token.name }),
        );
      }
      flow.component.forEach((token) =>
        connections.push({ from: token.reference, to: token.name }),
      );

      const nextPaths = connections
        .map(({ from, to }) => {
          const p1 = centerRight(from);
          const p2 = centerLeft(to);
          if (!p1 || !p2) return null;
          const midX = (p1.x + p2.x) / 2;
          return `M ${p1.x} ${p1.y} C ${midX} ${p1.y} ${midX} ${p2.y} ${p2.x} ${p2.y}`;
        })
        .filter((d): d is string => Boolean(d));
      setPaths(nextPaths);
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [flow]);

  return (
    <div ref={containerRef} className="relative hidden md:block">
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="var(--color-neutral-200)"
            strokeWidth={1.5}
          />
        ))}
      </svg>
      {/* Titles share one top-aligned row regardless of how tall each
          column's own pill stack ends up being. */}
      <div className="grid grid-cols-3 gap-16">
        <h4 className={`${TIER_LABEL_CLASSNAME} text-center`}>Primitives</h4>
        <h4 className={`${TIER_LABEL_CLASSNAME} text-center`}>
          Semantic tokens
        </h4>
        <h4 className={`${TIER_LABEL_CLASSNAME} text-center`}>
          Component tokens
        </h4>
      </div>
      {/* Pill stacks are a separate row so uneven column heights (1
          primitive vs 4 semantic vs 3 component tokens) can be centered
          relative to each other without dragging the titles out of line. */}
      <div className="mt-6 grid grid-cols-3 items-center gap-16">
        <div className="flex flex-col items-center gap-6">
          {flow.primitives.map((token) => (
            <TokenPill
              key={token.name}
              token={token}
              pillRef={(el) => {
                if (el) pillRefs.current.set(token.name, el);
                else pillRefs.current.delete(token.name);
              }}
            />
          ))}
        </div>
        <div className="flex flex-col items-start gap-6">
          {flow.semantic.map((token) => (
            <TokenPill
              key={token.name}
              token={token}
              pillRef={(el) => {
                if (el) pillRefs.current.set(token.name, el);
                else pillRefs.current.delete(token.name);
              }}
            />
          ))}
        </div>
        <div className="flex flex-col items-start gap-6">
          {flow.component.map((token) => (
            <TokenPill
              key={token.name}
              token={token}
              pillRef={(el) => {
                if (el) pillRefs.current.set(token.name, el);
                else pillRefs.current.delete(token.name);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Mobile: the desktop's curved connectors don't have room to breathe on a
// narrow screen, so each tier is just stacked as its own labeled group.
function DesignTokenFlowMobile({ flow }: DesignTokenFlowProps) {
  return (
    <div className="flex flex-col gap-8 md:hidden">
      <div className="flex flex-col gap-3">
        <h4 className={TIER_LABEL_CLASSNAME}>Primitives</h4>
        <div className="flex flex-col items-start gap-2">
          {flow.primitives.map((token) => (
            <TokenPill key={token.name} token={token} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h4 className={TIER_LABEL_CLASSNAME}>Semantic tokens</h4>
        <div className="flex flex-col items-start gap-2">
          {flow.semantic.map((token) => (
            <TokenPill key={token.name} token={token} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h4 className={TIER_LABEL_CLASSNAME}>Component tokens</h4>
        <div className="flex flex-col items-start gap-2">
          {flow.component.map((token) => (
            <TokenPill key={token.name} token={token} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function DesignTokenFlow({ flow }: DesignTokenFlowProps) {
  return (
    <>
      <DesignTokenFlowMobile flow={flow} />
      <DesignTokenFlowDesktop flow={flow} />
    </>
  );
}
