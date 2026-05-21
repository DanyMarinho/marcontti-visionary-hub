import React, { useRef } from 'react';
import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  separator?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  duration = 2000,
  decimals = 0,
  separator = '.',
  className,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(containerRef, { triggerOnce: true });

  const displayValue = useCountUp(isInView ? value : 0, 0, { duration, decimals });

  // Custom separator implementation if needed, though toLocaleString handles it
  const formattedValue = separator === '.' ? displayValue : displayValue.replace(/,/g, separator);

  return (
    <span ref={containerRef} className={cn('font-mono', className)}>
      {prefix}{formattedValue}{suffix}
    </span>
  );
};
