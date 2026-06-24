import React, { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { STATS } from '../../../constants/site';
import { images } from '../../../lib/images';
import { easePremium } from '../../../animations/variants';
import Button from '../../ui/Button';
import MagneticButton from '../../ui/MagneticButton';
import AnimatedCounter from '../../ui/AnimatedCounter';

export function HeroSection() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.4]);
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(40);
  const glow = useMotionTemplate`radial-gradient(800px circle at ${glowX}% ${glowY}%, rgba(201,162,39,0.12), transparent 60%)`;
  const onMove = (e) => {
    if (reduceMotion || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    glowX.set(((e.clientX - r.left) / r.width) * 100);
    glowY.set(((e.clientY - r.top) / r.height) * 100);
  };

  const heroStats = STATS.map((s) => ({
    value: s.value,
    suffix: s.suffix,
    label: t(s.labelKey),
  }));

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative min-h-screen flex items-center overflow-hidden bg-primary"
      aria-label="Hero"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0" aria-hidden>
        <img src={images.hero} alt="" className="h-full w-full object-cover object-top opacity-55" loading="eager" />
        <motion.div className="absolute inset-0 bg-hero-luxury" />
        <motion.div className="absolute inset-0" style={{ background: glow }} />
        <motion.div className="absolute inset-0 bg-noise opacity-[0.04]" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 container-premium w-full py-28 md:py-36">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easePremium }}
          className="max-w-4xl"
        >
          <p className="section-kicker">{t('hero.kicker')}</p>
          <h1 className="font-heading text-display-xl text-off-white mt-4">
            {t('hero.title')}{' '}
            <span className="text-gradient-accent">{t('hero.titleHighlight')}</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">{t('hero.subtitle')}</p>
          <motion.div className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            {t('hero.trustBadge')}
          </motion.div>
          <motion.div className="mt-10 flex flex-wrap gap-4">
            <MagneticButton to="/contact">{t('hero.ctaPrimary')}</MagneticButton>
            <Button to="/focus-areas" variant="secondary">
              {t('hero.ctaSecondary')}
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: easePremium }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl"
        >
          {heroStats.map((s) => (
            <motion.div key={s.label} className="glass-card p-5 text-center">
              <AnimatedCounter value={s.value} suffix={s.suffix} label={s.label} />
            </motion.div>
          ))}
        </motion.div>

      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
        animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs tracking-widest uppercase">{t('hero.scroll')}</span>
        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}

export default HeroSection;