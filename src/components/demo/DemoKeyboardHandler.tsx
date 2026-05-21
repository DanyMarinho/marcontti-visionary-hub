import React, { useEffect } from 'react';
export const DemoKeyboardHandler: React.FC = () => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'd') console.log('Demo mode toggled');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);
  return null;
};
export default DemoKeyboardHandler;