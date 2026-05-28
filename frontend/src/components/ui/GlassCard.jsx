import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useThemeMode } from '../../context/ThemeContext';

/**
 * Glass surface card. Uses inherit={false} so parent stagger/fadeUp variants
 * are not applied twice (which caused duplicate offset white layers in light mode).
 */
export function GlassCard({ children, className = '', hover = true, ...props }) {
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const reduceMotion = useReducedMotion();
  const base = isLight ? 'glass-card-light' : 'glass-card';

  return (
    <motion.div
      inherit={false}
      className={`${base} ${className}`}
      whileHover={hover && !reduceMotion ? { y: -3 } : undefined}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default GlassCard;
