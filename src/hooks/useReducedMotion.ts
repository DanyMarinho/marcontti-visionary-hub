import { useEffect, useState } from 'react';

export const useReducedMotion = () => {
  const [matches, setMatches] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return {
    animate: matches ? { opacity: 1 } : {},
    transition: matches ? { duration: 0 } : { duration: 0.3 }
  };
};
