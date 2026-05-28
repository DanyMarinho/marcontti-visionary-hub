import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChartSkeletonProps {
  className?: string;
  height?: number | string;
}

export function ChartSkeleton({ className, height = 300 }: ChartSkeletonProps) {
  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="flex items-end justify-between h-[200px] gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton 
            key={i} 
            className="w-full" 
            style={{ height: `${Math.floor(Math.random() * 60) + 20}%` }} 
          />
        ))}
      </div>
      <div className="flex justify-between">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-2 w-8" />
        ))}
      </div>
    </div>
  );
}
