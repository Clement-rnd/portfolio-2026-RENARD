import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { Squircle } from "./Squircle";
import { DotSeparator } from "./DotSeparator";

export interface ProjectIntroCardProps {
  icon: IconSvgElement;
  title: string;
  description: string;
}

export function ProjectIntroCard({
  icon,
  title,
  description,
}: ProjectIntroCardProps) {
  return (
    <Squircle
      cornerRadius={8}
      cornerSmoothing={1}
      borderColor="#F0EFEF"
      fill="#FCFCFC"
      className="h-full"
    >
      <div className="flex h-full flex-col gap-4 p-6">
        <h3 className="flex items-center gap-2 font-casta text-xl leading-tight">
          <span className="text-heading">
            <HugeiconsIcon icon={icon} size={20} />
          </span>
          <span className="text-heading">
            <DotSeparator />
          </span>
          <span className="font-bold text-heading">{title}</span>
        </h3>
        <p className="text-lg font-medium text-body">{description}</p>
      </div>
    </Squircle>
  );
}
