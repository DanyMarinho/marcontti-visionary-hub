import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useMediaQuery';

interface GradientButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  className,
  onClick,
  href,
  size = 'md',
}) => {
  const { animate: shouldAnimate } = useReducedMotion();

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-bold',
  };

  const baseClasses = cn(
    'relative inline-flex items-center justify-center overflow-hidden rounded-[12px] bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] text-white transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95',
    sizeClasses[size],
    className
  );

  const hoverEffect = shouldAnimate ? { scale: 1.05 } : {};

  if (href) {
    return (
      <motion.a
        href={href}
        className={baseClasses}
        whileHover={hoverEffect}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={baseClasses}
      whileHover={hoverEffect}
    >
      {children}
    </motion.button>
  );
};
