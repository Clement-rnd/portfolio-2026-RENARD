import type { ProcessStep } from "../data/process";
import { DotSeparator } from "./DotSeparator";
import { Squircle } from "./Squircle";

export interface ProcessCardProps {
  step: ProcessStep;
}

export function ProcessCard({ step }: ProcessCardProps) {
  return (
    <Squircle
      cornerRadius={8}
      cornerSmoothing={1}
      borderColor="var(--color-neutral-200)"
      fill="none"
      className="h-full"
    >
      <div className="flex h-full flex-col gap-4 p-6">
        <h3 className="flex items-center gap-2 font-casta text-xl leading-tight">
          <span className="font-bold text-heading">{step.number}</span>
          <span className="text-heading">
            <DotSeparator />
          </span>
          <span className="font-bold text-heading">{step.title}</span>
        </h3>
        <p className="text-lg font-medium text-body">{step.description}</p>
      </div>
    </Squircle>
  );
}
