import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
  onClick?: () => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  strength = 0.3,
  className,
  onClick,
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { animate: shouldAnimate } = useReducedMotion();
  
  const springOptions = { damping: 25, stiffness: 300 };
  const translateX = useSpring(0, springOptions);
  const translateY = useSpring(0, springOptions);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current || !shouldAnimate) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // Radius of attraction: 100px
    const radius = 100;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < radius) {
      translateX.set(distanceX * strength);
      translateY.set(distanceY * strength);
    } else {
      translateX.set(0);
      translateY.set(0);
    }
  };

  const handleMouseLeave = () => {
    translateX.set(0);
    translateY.set(0);
  };

  return (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: translateX,
        y: translateY,
      }}
      className={cn('inline-block', className)}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
