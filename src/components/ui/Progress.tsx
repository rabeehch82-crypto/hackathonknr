import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  indicatorClassName?: string;
}

export function Progress({ value, max = 100, className, indicatorClassName, ...props }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("relative h-2.5 w-full overflow-hidden rounded-full bg-secondary/80", className)} {...props}>
      <div
        className={cn("h-full w-full flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500 ease-out", indicatorClassName)}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
}
