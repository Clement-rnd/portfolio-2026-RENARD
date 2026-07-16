import { HugeiconsIcon } from "@hugeicons/react";
import type { ProcessStep } from "../data/process";
import { Squircle } from "./Squircle";

export interface ProcessCardProps {
  step: ProcessStep;
}

export function ProcessCard({ step }: ProcessCardProps) {
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
            <HugeiconsIcon icon={step.icon} size={20} />
          </span>
          <span className="font-bold text-heading">{step.title}</span>
        </h3>
        <p className="text-lg font-medium text-body">{step.description}</p>
      </div>
    </Squircle>
  );
}
