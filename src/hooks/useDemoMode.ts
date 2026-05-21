import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store';

export const useDemoMode = () => {
  const { autoInjectEnabled, autoInjectInterval, injectLeadGlobal } = useAppStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoInjectEnabled) {
      intervalRef.current = setInterval(() => {
        injectLeadGlobal();
      }, autoInjectInterval * 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoInjectEnabled, autoInjectInterval, injectLeadGlobal]);
};
