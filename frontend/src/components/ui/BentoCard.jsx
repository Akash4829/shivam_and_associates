import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useThemeMode } from '../../context/ThemeContext';
import Icon from './Icons';

export function BentoCard({
  icon,
  title,
  description,
  to,
  href,
  ctaLabel,
  span = '',
  className = '',
  children,
  accentBorder = true,
  active = false,
}) {
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const reduceMotion = useReducedMotion();

  const base = `${
    isLight
      ? 'border-navy/10 bg-white hover:border-accent/40'
      : 'border-white/[0.08] bg-white/[0.03] hover:border-accent/30'
  } ${active ? '!border-accent/60 shadow-glow-accent' : ''}`;

  const inner = (
    <motion.div
      inherit={false}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.35 }}
      className={`relative h-full overflow-hidden rounded-2xl border p-6 transition-all duration-500 ${
        accentBorder ? base : ''
      } hover:shadow-glow-accent`}
    >
      <div className="flex flex-col justify-between h-full gap-5">
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/12 text-accent">
            <Icon name={icon} className="w-6 h-6" />
          </div>
        )}
        <div className="space-y-2">
          {title && (
            <h3
              className={`font-display font-semibold text-lg ${
                isLight ? 'text-ink' : 'text-off-white'
              }`}
            >
              {title}
            </h3>
          )}
          {description && (
            <p className={`text-sm leading-relaxed ${isLight ? 'text-muted' : 'text-slate-400'}`}>
              {description}
            </p>
          )}
          {children}
          {ctaLabel && (
            <span className="mt-1 inline-flex text-sm font-semibold text-accent group-hover:translate-x-0.5 transition-transform">
              {ctaLabel} →
            </span>
          )}
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-px rounded-2xl bg-gradient-to-br from-accent/0 via-accent/0 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden
      />
    </motion.div>
  );

  if (to) {
    return (
      <Link to={to} className={`group block h-full ${span} ${className}`}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={`group block h-full ${span} ${className}`}
      >
        {inner}
      </a>
    );
  }
  return <div className={`group block h-full ${span} ${className}`}>{inner}</div>;
}

export default BentoCard;
