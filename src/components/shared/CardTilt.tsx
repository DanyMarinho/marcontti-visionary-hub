import React, { useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useMediaQuery';

interface CardTiltProps {
  children: React.ReactNode;
  className?: string;
  maxRotation?: number;
  perspective?: number;
}

export const CardTilt: React.FC<CardTiltProps> = ({
  children,
  className,
  maxRotation = 3,
  perspective = 1000,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { animate: shouldAnimate } = useReducedMotion();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [maxRotation, -maxRotation]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-maxRotation, maxRotation]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !shouldAnimate) return;
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

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        perspective,
      }}
      className={cn('transition-all duration-300', className)}
    >
      {children}
    </motion.div>
  );
};
