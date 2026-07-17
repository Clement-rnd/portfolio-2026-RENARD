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

// Matches the base `gap-16` (4rem) spacing used everywhere else, but this
// diagram needs to compute it dynamically (see below) so it's a plain JS
// constant instead of a Tailwind class.
const BASE_GAP = 64;

// Desktop: primitives fan out into semantic tokens, and whichever semantic
// token a component token references fans out into that component token —
// each connector is a real bezier curve computed from the pills' actual
// rendered positions (they're laid out by flexbox, not fixed coordinates),
// re-measured whenever the flow data or viewport size changes.
//
// The 3 columns behave like `justify-between`: when they fit at their
// natural width, the leftover space is added on top of the base gap so the
// row spans the full available width. Only when even the base gap doesn't
// leave enough room does the whole diagram (pills + connectors) uniformly
// scale down instead — rather than wrapping or clipping, e.g. on tablet.
// `offsetWidth`/`scrollHeight` are layout-box measurements, unaffected by a
// CSS transform, so a column's own width stays reliable regardless of the
// diagram's current scale. `gap`/`transform` are written straight to the
// DOM (not React state) so the pill positions can be re-measured in the
// same pass, already reflecting the just-applied layout — otherwise the
// connectors would be one frame stale, computed from the previous gap.
function DesignTokenFlowDesktop({ flow }: DesignTokenFlowProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pillRefs = useRef(new Map<string, HTMLDivElement>());
  const [paths, setPaths] = useState<string[]>([]);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const container = containerRef.current;
    if (!outer || !container) return;

    function measure() {
      if (!outer || !container) return;

      const columnWidths = columnRefs.current.map(
        (el) => el?.offsetWidth ?? 0,
      );
      const totalColumnWidth = columnWidths.reduce((sum, w) => sum + w, 0);
      const available = outer.clientWidth;
      const fits = totalColumnWidth + BASE_GAP * 2 <= available;
      const scale = fits
        ? 1
        : available / (totalColumnWidth + BASE_GAP * 2);
      const gap = fits ? (available - totalColumnWidth) / 2 : BASE_GAP;

      container.style.gap = `${gap}px`;
      container.style.transform = `scale(${scale})`;
      outer.style.height = `${container.scrollHeight * scale}px`;

      const containerRect = container.getBoundingClientRect();

      function centerRight(name: string) {
        const el = pillRefs.current.get(name);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: (r.right - containerRect.left) / scale,
          y: (r.top + r.height / 2 - containerRect.top) / scale,
        };
      }
      function centerLeft(name: string) {
        const el = pillRefs.current.get(name);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: (r.left - containerRect.left) / scale,
          y: (r.top + r.height / 2 - containerRect.top) / scale,
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
    observer.observe(outer);
    return () => observer.disconnect();
  }, [flow]);

  return (
    <div
      ref={outerRef}
      className="mx-auto hidden max-w-[75vw] overflow-hidden md:block"
    >
      <div
        ref={containerRef}
        className="relative flex w-full items-stretch"
        style={{ transformOrigin: "top left" }}
      >
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
        {/* Each column is a single flex item (title + pill stack together)
            so title and pills always share the same natural width — no
            separate grid tracks to keep in sync. The row stretches every
            column to the tallest one's height, and each pill stack centers
            within that shared height while its title stays pinned to top. */}
        <div
          ref={(el) => {
            columnRefs.current[0] = el;
          }}
          className="flex shrink-0 flex-col items-center"
        >
          <h4 className={`${TIER_LABEL_CLASSNAME} text-center`}>
            Primitives
          </h4>
          <div className="flex flex-1 flex-col items-center justify-center gap-6 pt-6">
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
        </div>
        <div
          ref={(el) => {
            columnRefs.current[1] = el;
          }}
          className="flex shrink-0 flex-col items-start"
        >
          <h4 className={`${TIER_LABEL_CLASSNAME} w-full text-center`}>
            Semantic tokens
          </h4>
          <div className="flex flex-1 flex-col items-start justify-center gap-6 pt-6">
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
        </div>
        <div
          ref={(el) => {
            columnRefs.current[2] = el;
          }}
          className="flex shrink-0 flex-col items-start"
        >
          <h4 className={`${TIER_LABEL_CLASSNAME} w-full text-center`}>
            Component tokens
          </h4>
          <div className="flex flex-1 flex-col items-start justify-center gap-6 pt-6">
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
