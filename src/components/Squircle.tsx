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
    <div
      ref={ref}
      className={`relative ${className}`}
      // Clips children (e.g. a full-bleed image) to the exact squircle
      // silhouette — without this, content with sharp rectangular corners
      // would just paint over the rounded SVG fill/border underneath. Only
      // applied when there's no border: since the stroke is drawn centered
      // on the path, clipping to that same path would cut its outer half off.
      style={
        path && borderWidth === 0 ? { clipPath: `path('${path}')` } : undefined
      }
    >
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
      {/* h-full/w-full only take effect when the outer div has an explicit
          size (e.g. an image container); for content-sized buttons/tags the
          outer div's height is auto, so these resolve to auto too (no-op). */}
      <div className="relative grow h-full w-full">{children}</div>
    </div>
  );
}
