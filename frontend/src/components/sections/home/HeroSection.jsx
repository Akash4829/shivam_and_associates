import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { images } from '../../../lib/images';
import Button from '../../ui/Button';
import { useThemeMode } from '../../../context/ThemeContext';

export function HeroSection() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';

  return (
    <section
      className={`relative overflow-hidden ${isLight ? 'bg-off-white' : 'bg-primary'}`}
      aria-labelledby="hero-heading"
    >
      <div className="container-premium grid items-center gap-10 py-16 md:py-20 lg:grid-cols-12 lg:gap-14 lg:py-24">
        <motion.div
          className="lg:col-span-6"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <p className="section-kicker">{t('hero.kicker')}</p>
          <h1
            id="hero-heading"
            className={`font-heading text-display-xl mt-3 ${isLight ? 'text-ink' : 'text-off-white'}`}
          >
            {t('hero.title')}
            <span className="mt-1 block text-accent">{t('hero.titleHighlight')}</span>
          </h1>
          <p className={`mt-5 max-w-xl text-base leading-relaxed sm:text-lg ${isLight ? 'text-muted' : 'text-slate-300'}`}>
            {t('hero.subtitle')}
          </p>
          <p className={`mt-4 text-sm font-medium ${isLight ? 'text-navy/70' : 'text-accent-light'}`}>
            {t('hero.trustBadge')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/contact">{t('hero.ctaPrimary')}</Button>
            <Button to="/focus-areas" variant="secondary">
              {t('hero.ctaSecondary')}
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="relative lg:col-span-6"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: reduceMotion ? 0 : 0.1 }}
        >
          <div className={`overflow-hidden rounded-xl border ${isLight ? 'border-border' : 'border-white/10'}`}>
            <img
              src={images.hero}
              alt={t('hero.imageAlt')}
              className="aspect-[4/3] w-full object-cover object-[center_20%] lg:aspect-[5/4]"
              fetchPriority="high"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
