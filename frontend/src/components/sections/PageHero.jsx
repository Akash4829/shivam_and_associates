import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useThemeMode } from '../../context/ThemeContext';
import Button from '../ui/Button';

export function PageHero({
  kicker,
  title,
  titleHighlight,
  subtitle,
  backgroundImage,
  primaryTo,
  primaryHref,
  primaryLabel,
  secondaryTo,
  secondaryLabel,
  minHeightClass = 'min-h-[42vh] md:min-h-[48vh]',
  children,
}) {
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const reduceMotion = useReducedMotion();

  return (
    <section
      className={`relative overflow-hidden ${minHeightClass} ${isLight ? 'bg-navy' : 'bg-primary'}`}
      aria-label={title}
    >
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_20%] opacity-35"
          loading="eager"
        />
      )}
      <div className="absolute inset-0 bg-navy/70" aria-hidden />
      <div className="relative z-10 container-premium py-16 md:py-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          {kicker && <p className="section-kicker">{kicker}</p>}
          <h1 className="font-heading text-display-lg mt-3 text-off-white">
            {title}
            {titleHighlight ? <span className="text-accent"> {titleHighlight}</span> : null}
          </h1>
          {subtitle && <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">{subtitle}</p>}
          {(primaryLabel || secondaryLabel || children) && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {primaryLabel &&
                (primaryHref ? (
                  <Button href={primaryHref}>{primaryLabel}</Button>
                ) : (
                  <Button to={primaryTo || '/contact'}>{primaryLabel}</Button>
                ))}
              {secondaryLabel && secondaryTo && (
                <Button to={secondaryTo} variant="secondary">
                  {secondaryLabel}
                </Button>
              )}
              {children}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default PageHero;
