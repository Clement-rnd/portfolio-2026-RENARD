import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { Squircle } from "./Squircle";

export interface PersonaBubbleProps {
  icon: IconSvgElement;
  text: string;
  /** Which side the avatar sits on, bubble tail points toward it. */
  align?: "left" | "right";
}

export function PersonaBubble({
  icon,
  text,
  align = "left",
}: PersonaBubbleProps) {
  const isRight = align === "right";

  return (
    <div
      className={`flex items-center gap-4 ${isRight ? "flex-row-reverse" : ""}`}
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#FCFCFC] text-body drop-shadow-md">
        <HugeiconsIcon icon={icon} size={28} />
      </div>
      <div className="relative drop-shadow-md">
        <Squircle
          cornerRadius={16}
          cornerSmoothing={1}
          fill="#FFFFFF"
          borderWidth={0}
        >
          <p className="max-w-[16rem] px-5 py-4 text-base font-medium text-heading">
            {text}
          </p>
        </Squircle>
        <span
          className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-white ${
            isRight ? "-right-1" : "-left-1"
          }`}
        />
      </div>
    </div>
  );
}
