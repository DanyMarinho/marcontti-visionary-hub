import { useEffect } from 'react';

export const useKeyboardShortcut = (key: string, callback: () => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keys = key.toLowerCase().split('+');
      const ctrl = keys.includes('ctrl');
      const shift = keys.includes('shift');
      const alt = keys.includes('alt');
      const targetKey = keys[keys.length - 1];

      const ctrlMatch = ctrl ? event.ctrlKey || event.metaKey : true;
      const shiftMatch = shift ? event.shiftKey : true;
      const altMatch = alt ? event.altKey : true;
      const keyMatch = event.key.toLowerCase() === targetKey;

      if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback]);
};
