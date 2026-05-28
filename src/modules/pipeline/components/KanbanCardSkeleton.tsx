import { Skeleton } from "@/components/ui/skeleton";

export function KanbanCardSkeleton() {
  return (
    <div className="p-3 bg-card border rounded-lg space-y-3 mb-3 shadow-sm">
      <Skeleton className="h-4 w-[80%]" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}
