import React, { useMemo, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useMediaQuery';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  tilt?: boolean;
  animatedBorder?: boolean;
  glow?: 'blue' | 'purple' | 'cyan';
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hover = false,
  tilt = false,
  animatedBorder = false,
  glow,
}) => {
  const { animate: shouldAnimate } = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Tilt State
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [3, -3]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-3, 3]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !cardRef.current || !shouldAnimate) return;
    
    // Check if touch device
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const glowClass = useMemo(() => {
    if (!glow) return '';
    const colors = {
      blue: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]',
      purple: 'shadow-[0_0_20px_rgba(139,92,246,0.2)]',
      cyan: 'shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    };
    return colors[glow];
  }, [glow]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: tilt ? rotateX : 0,
        rotateY: tilt ? rotateY : 0,
        perspective: 1000,
      }}
      whileHover={hover && shouldAnimate ? { scale: 1.02, boxShadow: '0 0 30px rgba(255, 255, 255, 0.05)' } : {}}
      className={cn(
        'glass-card relative overflow-hidden transition-all duration-300',
        animatedBorder && 'animated-border',
        glowClass,
        className
      )}
    >
      {children}
    </motion.div>
  );
};
