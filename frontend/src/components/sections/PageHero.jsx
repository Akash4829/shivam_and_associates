import React, { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useThemeMode } from '../../context/ThemeContext';
import Button from '../ui/Button';
import { easePremium } from '../../animations/variants';

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
  minHeightClass = 'min-h-[62vh] md:min-h-[68vh]',
  children,
}) {
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 110]);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(40);
  const glow = useMotionTemplate`radial-gradient(700px circle at ${glowX}% ${glowY}%, rgba(201,162,39,0.10), transparent 60%)`;

  const onMove = (e) => {
    if (reduceMotion || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    glowX.set(((e.clientX - r.left) / r.width) * 100);
    glowY.set(((e.clientY - r.top) / r.height) * 100);
  };

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className={`relative flex items-center overflow-hidden ${minHeightClass} ${
        isLight ? 'bg-off-white' : 'bg-primary'
      }`}
      aria-label="Page hero"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0" aria-hidden>
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt=""
            className="h-full w-full object-cover object-[center_20%] opacity-55"
            loading="eager"
          />
        )}
        <motion.div className="absolute inset-0 bg-hero-luxury" />
        <motion.div className="absolute inset-0" style={{ background: glow }} />
        <motion.div className="absolute inset-0 bg-noise opacity-[0.04]" />
      </motion.div>

      <div className="relative z-10 container-premium py-20 md:py-24 w-full">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easePremium }}
          className="max-w-3xl"
        >
          {kicker && <p className="section-kicker">{kicker}</p>}
          <h1
            className={`font-heading text-display-lg mt-3 ${
              isLight ? 'text-ink' : 'text-off-white'
            }`}
          >
            {title}
            {titleHighlight && (
              <>
                {' '}
                <span className="text-gradient-accent">{titleHighlight}</span>
              </>
            )}
          </h1>
          {subtitle && (
            <p
              className={`mt-5 text-base sm:text-lg leading-relaxed max-w-2xl ${
                isLight ? 'text-muted' : 'text-slate-300'
              }`}
            >
              {subtitle}
            </p>
          )}
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
