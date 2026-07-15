import { Squircle } from "./Squircle";

export interface TargetUserCardProps {
  title: string;
  context: string;
  needs: string;
}

export function TargetUserCard({ title, context, needs }: TargetUserCardProps) {
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
        <div className="flex flex-col gap-2">
          <p className="text-lg font-medium text-body">Contexte : {context}</p>
          <p className="text-lg font-medium text-body">Besoins : {needs}</p>
        </div>
      </div>
    </Squircle>
  );
}
