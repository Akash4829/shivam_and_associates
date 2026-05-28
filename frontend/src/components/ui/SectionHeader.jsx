import React from 'react';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../animations/variants';
import { useThemeMode } from '../../context/ThemeContext';

export function SectionHeader({ kicker, title, subtitle, align = 'center', className = '' }) {
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const alignClass = align === 'left' ? 'text-left' : 'text-center mx-auto';

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      className={`max-w-3xl mb-14 md:mb-16 ${alignClass} ${className}`}
    >
      {kicker && (
        <motion.p variants={fadeUp} className="section-kicker">
          {kicker}
        </motion.p>
      )}
      <motion.h2
        variants={fadeUp}
        className={isLight ? 'section-title-light' : 'section-title'}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className={`mt-4 text-base sm:text-lg leading-relaxed max-w-2xl ${align === 'center' ? 'mx-auto' : ''} ${
            isLight ? 'text-muted' : 'text-slate-400'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

export default SectionHeader;
