import { Squircle } from "./Squircle";

export interface KeyDecisionCardProps {
  title: string;
  description: string;
}

export function KeyDecisionCard({ title, description }: KeyDecisionCardProps) {
  return (
    <Squircle
      cornerRadius={8}
      cornerSmoothing={1}
      borderColor="#F0EFEF"
      fill="#FCFCFC"
      className="h-full"
    >
      <div className="flex h-full flex-col gap-4 p-6">
        <h3 className="font-casta text-xl font-bold leading-tight text-heading">
          {title}
        </h3>
        <p className="text-lg font-medium text-body">{description}</p>
      </div>
    </Squircle>
  );
}
