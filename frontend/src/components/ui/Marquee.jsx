import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function Marquee({ children, speed = 36, className = '', pauseOnHover = true, direction = 'left' }) {
  const reduceMotion = useReducedMotion();
  const items = React.Children.toArray(children);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--color-primary,#0B0F19)] to-transparent z-10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--color-primary,#0B0F19)] to-transparent z-10"
        aria-hidden
      />
      <motion.div
        className={`flex gap-6 w-max ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        animate={
          reduceMotion
            ? undefined
            : { x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }
        }
        transition={
          reduceMotion ? undefined : { duration: speed, repeat: Infinity, ease: 'linear' }
        }
      >
        {[...items, ...items].map((child, i) => (
          <div key={i} className="shrink-0">
            {child}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default Marquee;
