import { useState, useEffect } from 'react';

interface UseCountUpProps {
  end: number;
  duration?: number;
  start?: number;
  isVisible: boolean;
}

export const useCountUp = ({ end, duration = 2000, start = 0, isVisible }: UseCountUpProps) => {
  const [current, setCurrent] = useState(start);

  useEffect(() => {
    if (!isVisible) return;

    setCurrent(start);
    const stepTime = Math.abs(Math.floor(duration / (end - start)));
    const startTime = Date.now();

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const value = Math.floor(easeOutQuart * (end - start) + start);
      
      setCurrent(value);

      if (progress >= 1) {
        clearInterval(timer);
        setCurrent(end);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, start, isVisible]);

  return current;
};