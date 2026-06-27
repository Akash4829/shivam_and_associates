import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useThemeMode } from '../../context/ThemeContext';
import Icon from './Icons';

export function BentoCard({
  icon,
  title,
  description,
  image,
  to,
  href,
  ctaLabel,
  span = '',
  className = '',
  children,
  accentBorder = true,
  active = false,
  onClick,
}) {
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const reduceMotion = useReducedMotion();

  const borderCls = accentBorder
    ? isLight
      ? 'border-navy/10 bg-white hover:border-accent/40'
      : 'border-white/[0.08] bg-white/[0.03] hover:border-accent/30'
    : '';
  const activeCls = active ? '!border-accent/60 shadow-glow-accent' : '';

  const inner = (
    <motion.div
      inherit={false}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.35 }}
      onClick={onClick}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-500 hover:shadow-glow-accent ${borderCls} ${activeCls} ${
        image ? 'p-0' : 'p-6'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {image ? (
        <>
          <div className="relative h-44 sm:h-48 shrink-0 overflow-hidden">
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent"
              aria-hidden
            />
            {icon && (
              <div
                className={`absolute bottom-3 left-4 flex h-10 w-10 items-center justify-center rounded-lg text-accent shadow-sm ${
                  isLight ? 'bg-white/95' : 'bg-primary/90 ring-1 ring-white/10'
                }`}
              >
                <Icon name={icon} className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-3 p-5">
            {title && (
              <h3
                className={`font-display font-semibold text-lg leading-snug ${
                  isLight ? 'text-ink' : 'text-off-white'
                }`}
              >
                {title}
              </h3>
            )}
            {description && (
              <p
                className={`text-sm leading-relaxed line-clamp-3 ${
                  isLight ? 'text-muted' : 'text-slate-400'
                }`}
              >
                {description}
              </p>
            )}
            {children}
            {ctaLabel && (
              <span className="mt-auto inline-flex text-sm font-semibold text-accent group-hover:translate-x-0.5 transition-transform">
                {ctaLabel} →
              </span>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4">
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
      )}
      <div
        className="pointer-events-none absolute inset-px rounded-2xl bg-gradient-to-br from-accent/0 via-accent/0 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        aria-hidden
      />
    </motion.div>
  );

  if (to) {
    return (
      <Link to={to} className={`block h-full ${span} ${className}`}>
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
        className={`block h-full ${span} ${className}`}
      >
        {inner}
      </a>
    );
  }
  return <div className={`block h-full ${span} ${className}`}>{inner}</div>;
}

export default BentoCard;
