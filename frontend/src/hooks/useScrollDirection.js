import { useEffect, useState } from 'react';

export function useScrollDirection(threshold = 8) {
  const [direction, setDirection] = useState('up');

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - lastY) > threshold) {
          setDirection(y > lastY ? 'down' : 'up');
          lastY = y;
        }
        ticking = false;
      });
      ticking = true;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return direction;
}

export default useScrollDirection;
