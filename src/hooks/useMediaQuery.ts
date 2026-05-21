import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

export function useReducedMotion() {
  const shouldReduceMotion = useFramerReducedMotion();
  
  return {
    shouldReduceMotion,
    animate: !shouldReduceMotion,
    transition: shouldReduceMotion ? { duration: 0 } : undefined
  };
}
