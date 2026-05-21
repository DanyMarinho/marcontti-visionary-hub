import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'card' | 'circle' | 'chart' | 'metric' | 'kanban' | 'chat';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width,
  height,
  className,
  variant = 'text',
}) => {
  const variantClasses = {
    text: 'rounded h-4 w-full',
    card: 'rounded-2xl h-40 w-full',
    circle: 'rounded-full h-12 w-12',
    chart: 'rounded-2xl h-60 w-full',
    metric: 'rounded-2xl h-24 w-full',
    kanban: 'rounded-xl h-[500px] w-full',
    chat: 'rounded-2xl h-12 w-2/3',
  };

  if (variant === 'metric') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonItem key={i} className={variantClasses.metric} />
        ))}
      </div>
    );
  }

  if (variant === 'kanban') {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 w-full">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="min-w-[280px] space-y-4">
            <SkeletonItem className="h-8 w-32 mb-4" />
            <SkeletonItem className="h-24 w-full" />
            <SkeletonItem className="h-24 w-full" />
            <SkeletonItem className="h-24 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'chat') {
    return (
      <div className="space-y-4 w-full p-4">
        <SkeletonItem className="h-12 w-2/3 mr-auto rounded-tr-2xl rounded-br-2xl rounded-bl-2xl" />
        <SkeletonItem className="h-12 w-1/2 ml-auto rounded-tl-2xl rounded-br-2xl rounded-bl-2xl bg-blue-500/20" />
        <SkeletonItem className="h-12 w-3/4 mr-auto rounded-tr-2xl rounded-br-2xl rounded-bl-2xl" />
        <SkeletonItem className="h-12 w-1/3 ml-auto rounded-tl-2xl rounded-br-2xl rounded-bl-2xl bg-blue-500/20" />
      </div>
    );
  }

  return (
    <SkeletonItem 
      className={cn(variantClasses[variant], className)} 
      style={{ width, height }} 
    />
  );
};

const SkeletonItem = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <div
    className={cn(
      'glass-card relative overflow-hidden bg-white/5 border-white/5',
      className
    )}
    style={style}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
  </div>
);
