import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
};

export const fadeInScale: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};

export const staggerContainer: Variants = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 }
};

export const hoverGlow = {
  whileHover: { scale: 1.02, boxShadow: '0 0 60px rgba(139,92,246,0.2)' }
};

export const typingDots: Variants = {
  animate: { y: [0, -5, 0], transition: { duration: 1.4, repeat: Infinity } }
};

export const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 }
};
