import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  className?: string;
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  isLoading,
  className
}: KpiCardProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[120px] mb-1" />
          <Skeleton className="h-3 w-[150px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-[#111111] border-[#1f1f1f] hover:border-orange-500/30 transition-all duration-300 shadow-none", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-[#888888]">{title}</CardTitle>
        <Icon className="h-4 w-4 text-orange-500 opacity-80" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black tracking-tighter text-white tabular-nums">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {trend && (
            <span className={cn(
              "text-xs font-semibold flex items-center",
              trend.isPositive ? "text-green-500" : "text-red-500"
            )}>
              {trend.isPositive ? <TrendingUp size={12} className="mr-0.5" /> : <TrendingDown size={12} className="mr-0.5" />}
              {trend.isPositive ? '+' : '-'}{trend.value}%
            </span>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
