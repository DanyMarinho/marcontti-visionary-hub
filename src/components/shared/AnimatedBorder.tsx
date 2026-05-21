import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
}

export const AnimatedBorder: React.FC<AnimatedBorderProps> = ({ children, className }) => {
  return (
    <div className={cn('animated-border', className)}>
      {children}
    </div>
  );
};
