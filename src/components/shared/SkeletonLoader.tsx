import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'card' | 'circle' | 'chart';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width,
  height,
  className,
  variant = 'text',
}) => {
  const variantClasses = {
    text: 'rounded-[var(--mg-radius-input)] h-4 w-full',
    card: 'rounded-[var(--mg-radius-card)] h-40 w-full',
    circle: 'rounded-full h-12 w-12',
    chart: 'rounded-[var(--mg-radius-card)] h-60 w-full',
  };

  return (
    <div
      className={cn(
        'glass-card relative overflow-hidden bg-white/5',
        variantClasses[variant],
        className
      )}
      style={{ width, height }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
    </div>
  );
};
