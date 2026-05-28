import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { easePremium } from '../../animations/variants';

export function AnimatedCounter({ value, suffix = '', label, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const isDecimal = String(value).includes('.');

  useEffect(() => {
    if (!inView) return undefined;
    if (reduceMotion) {
      setDisplay(value);
      return undefined;
    }
    const controls = animate(0, value, {
      duration: 2,
      ease: easePremium,
      onUpdate: (v) => setDisplay(isDecimal ? v.toFixed(1) : Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduceMotion, isDecimal]);

  return (
    <motion.div ref={ref} className={`text-center ${className}`}>
      <p className="font-heading text-4xl sm:text-5xl tabular-nums text-off-white">
        {display}
        <span className="text-accent">{suffix}</span>
      </p>
      {label && <p className="mt-2 text-sm text-muted font-medium">{label}</p>}
    </motion.div>
  );
}

export default AnimatedCounter;