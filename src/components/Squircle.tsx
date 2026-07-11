import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { getSvgPath } from "figma-squircle";

export interface SquircleProps {
  /** Corner radius (px), same meaning as Figma's corner radius. */
  cornerRadius?: number;
  /** 0 (sharp) to 1 (Figma's 100% / iOS-style smoothing). */
  cornerSmoothing?: number;
  borderColor?: string;
  borderWidth?: number;
  fill?: string;
  className?: string;
  children?: ReactNode;
}

// Renders a Figma-accurate "squircle" (corner-smoothed rounded rect) as an
// SVG background/border behind its children, sized via ResizeObserver so it
// tracks the content's natural (e.g. text-driven) dimensions.
export function Squircle({
  cornerRadius = 8,
  cornerSmoothing = 1,
  borderColor = "currentColor",
  borderWidth = 1,
  fill = "none",
  className = "",
  children,
}: SquircleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width + borderWidth,
        height: entry.contentRect.height + borderWidth,
      });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [borderWidth]);

  const path =
    size.width > 0 && size.height > 0
      ? getSvgPath({
          width: size.width,
          height: size.height,
          cornerRadius,
          cornerSmoothing,
          // Without this, small shapes (like our pills/buttons) don't have
          // enough room for the curve and it collapses back to a near-plain
          // circular corner — see figma-squircle's README.
          preserveSmoothing: true,
        })
      : "";

  return (
    <div ref={ref} className={`relative ${className}`}>
      {size.width > 0 && (
        <svg
          className="pointer-events-none absolute overflow-visible"
          style={{
            left: -borderWidth / 2,
            top: -borderWidth / 2,
            width: size.width,
            height: size.height,
          }}
          viewBox={`0 0 ${size.width} ${size.height}`}
        >
          <path
            d={path}
            fill={fill}
            stroke={borderColor}
            strokeWidth={borderWidth}
          />
        </svg>
      )}
      <div className="relative grow">{children}</div>
    </div>
  );
}
