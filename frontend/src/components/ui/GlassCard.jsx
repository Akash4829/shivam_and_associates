import React from 'react';
import { motion } from 'framer-motion';
import { useThemeMode } from '../../context/ThemeContext';

export function GlassCard({ children, className = '', hover = true, ...props }) {
  const { theme } = useThemeMode();
  const isLight = theme === 'light';

  return (
    <motion.div
      inherit={false}
      className={`legal-card ${className}`}
      data-theme={isLight ? 'light' : 'dark'}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default GlassCard;
