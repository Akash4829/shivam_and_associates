import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { TRUST_METRICS } from '../../../constants/site';
import {
  practiceAreas,
  whyChooseItems,
  testimonials,
  journeySteps,
  caseResults,
  faqItems,
} from '../../../data/practiceAreas';
import { images } from '../../../lib/images';
import { fadeUp, staggerContainer, easePremium } from '../../../animations/variants';
import SectionHeader from '../../ui/SectionHeader';
import GlassCard from '../../ui/GlassCard';
import Icon from '../../ui/Icons';
import Button from '../../ui/Button';
import BentoCard from '../../ui/BentoCard';
import Marquee from '../../ui/Marquee';
import FAQBlock from '../FAQBlock';
import { SITE } from '../../../constants/site';
import { useThemeMode } from '../../../context/ThemeContext';

export function TrustBar() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const highlights = whyChooseItems.slice(0, 3);

  return (
    <section className={`section-padding border-y ${isLight ? 'bg-white border-navy/10' : 'bg-secondary/50 border-white/[0.06]'}`}>
      <div className="container-premium space-y-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-5 gap-8"
        >
          {TRUST_METRICS.map((m) => (
            <motion.div key={m.labelKey} variants={fadeUp} className="text-center">
              <p className="font-heading text-2xl sm:text-3xl text-accent tabular-nums">{m.value}</p>
              <p className={`mt-1 text-xs sm:text-sm ${isLight ? 'text-muted' : 'text-slate-400'}`}>{t(m.labelKey)}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-6"
        >
          <motion.div variants={fadeUp}>
            <p className="section-kicker">{t('whyChoose.kicker')}</p>
            <h2 className={`font-display text-xl sm:text-2xl font-semibold ${isLight ? 'text-ink' : 'text-off-white'}`}>
              {t('whyChoose.title')}
            </h2>
            <p className={`mt-2 text-sm ${isLight ? 'text-muted' : 'text-slate-400'}`}>{t('whyChoose.subtitle')}</p>
          </motion.div>
          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {highlights.map((item) => (
              <div
                key={item.key}
                className={`rounded-xl border p-4 ${isLight ? 'border-navy/10 bg-off-white' : 'border-white/10 bg-white/5'}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent mb-3">
                  <Icon name={item.icon} className="w-5 h-5" />
                </div>
                <h3 className={`font-medium text-sm ${isLight ? 'text-ink' : 'text-off-white'}`}>
                  {t(`whyChoose.${item.key}`)}
                </h3>
                <p className={`mt-1 text-xs leading-relaxed ${isLight ? 'text-muted' : 'text-slate-400'}`}>
                  {t(`whyChoose.${item.key}Desc`)}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export function WhyChooseUs() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';

  return (
    <section className={`section-padding ${isLight ? 'bg-off-white' : 'bg-primary'}`}>
      <motion.div className="container-premium">
        <SectionHeader kicker={t('whyChoose.kicker')} title={t('whyChoose.title')} subtitle={t('whyChoose.subtitle')} />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {whyChooseItems.map((item) => (
            <GlassCard key={item.key} variants={fadeUp} className="h-full p-6 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Icon name={item.icon} className="w-6 h-6" />
              </div>
              <h3 className={`font-display font-semibold text-lg ${isLight ? 'text-ink' : 'text-off-white'}`}>
                {t(`whyChoose.${item.key}`)}
              </h3>
              <p className={`text-sm leading-relaxed ${isLight ? 'text-muted' : 'text-slate-400'}`}>
                {t(`whyChoose.${item.key}Desc`)}
              </p>
            </GlassCard>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export function PracticeAreasBento() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';

  return (
    <section className={`section-padding ${isLight ? 'bg-white' : 'bg-secondary/30'}`}>
      <motion.div className="container-premium">
        <SectionHeader kicker={t('practice.kicker')} title={t('practice.title')} subtitle={t('practice.subtitle')} />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {practiceAreas.map((area) => (
            <motion.div key={area.id} variants={fadeUp} className={area.span}>
              <BentoCard
                icon={area.icon}
                image={images[area.imageKey]}
                title={t(area.titleKey)}
                description={t(area.descKey)}
                to={area.to}
                ctaLabel={t('practice.learnMore')}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export function ClientJourney() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';

  return (
    <section className={`section-padding ${isLight ? 'bg-off-white' : 'bg-primary'}`}>
      <motion.div className="container-premium">
        <SectionHeader kicker={t('journey.kicker')} title={t('journey.title')} />
        <motion.div className="relative">
          <motion.div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" aria-hidden />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-5 gap-8"
          >
            {journeySteps.map((step) => (
              <motion.div key={step.step} variants={fadeUp} className="relative text-center md:text-left">
                <div className="mx-auto md:mx-0 flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 font-heading text-xl text-accent mb-4">
                  {step.step}
                </div>
                <h3 className={`font-semibold ${isLight ? 'text-ink' : 'text-off-white'}`}>{t(step.titleKey)}</h3>
                <p className={`mt-2 text-sm ${isLight ? 'text-muted' : 'text-slate-400'}`}>{t(step.descKey)}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function CaseResults() {
  const { t, i18n } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const [idx, setIdx] = useState(0);
  const reduceMotion = useReducedMotion();
  const c = caseResults[idx];
  const isHi = i18n.language === 'hi';

  const next = useCallback(() => setIdx((i) => (i + 1) % caseResults.length), []);
  const prev = useCallback(() => setIdx((i) => (i - 1 + caseResults.length) % caseResults.length), []);

  return (
    <section className={`section-padding ${isLight ? 'bg-white' : 'bg-secondary/30'}`}>
      <motion.div className="container-premium">
        <SectionHeader kicker={t('cases.kicker')} title={t('cases.title')} subtitle={t('cases.subtitle')} />
        <motion.div className="max-w-3xl mx-auto">
          <GlassCard className="p-8 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={reduceMotion ? false : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: easePremium }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">{isHi ? c.typeHi : c.type}</p>
                <h3 className={`mt-3 font-heading text-2xl ${isLight ? 'text-ink' : 'text-off-white'}`}>
                  {isHi ? c.resultHi : c.result}
                </h3>
                <p className={`mt-4 text-sm ${isLight ? 'text-muted' : 'text-slate-400'}`}>
                  {isHi ? c.highlightHi : c.highlight}
                </p>
                <motion.div className="mt-6 flex gap-6 text-sm">
                  <span>
                    <strong className="text-accent">{t('cases.timeline')}:</strong>{' '}
                    {isHi ? c.timelineHi : c.timeline}
                  </span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
            <motion.div className="mt-8 flex justify-between items-center">
              <motion.div className="flex gap-2">
                {caseResults.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIdx(i)}
                    className={`h-2 rounded-full transition-all ${i === idx ? 'w-8 bg-accent' : 'w-2 bg-white/20'}`}
                    aria-label={t('cases.caseSlide', { n: i + 1 })}
                  />
                ))}
              </motion.div>
              <motion.div className="flex gap-2">
                <button type="button" onClick={prev} className="rounded-xl border border-white/15 px-4 py-2 text-sm hover:border-accent/40" aria-label={t('cases.previous')}>←</button>
                <button type="button" onClick={next} className="rounded-xl border border-white/15 px-4 py-2 text-sm hover:border-accent/40" aria-label={t('cases.next')}>→</button>
              </motion.div>
            </motion.div>
          </GlassCard>
        </motion.div>
        <p className="text-center mt-8">
          <Link to="/case-studies" className="text-sm font-semibold text-accent hover:underline">
            {t('cases.viewAll')} →
          </Link>
        </p>
      </motion.div>
    </section>
  );
}

export function TestimonialsSection() {
  const { t, i18n } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const isHi = i18n.language === 'hi';

  return (
    <section className={`section-padding overflow-hidden ${isLight ? 'bg-off-white' : 'bg-primary'}`}>
      <motion.div className="container-premium">
        <SectionHeader kicker={t('testimonials.kicker')} title={t('testimonials.title')} subtitle={t('testimonials.subtitle')} />

        <Marquee speed={42} className="mb-10">
          {testimonials.map((item) => (
            <GlassCard key={item.name} className="w-[320px] p-6">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path d="M10 15l-5.878 3.09 1.122-6.545L0 6.91l6.561-.954L10 0l3.439 5.956 6.561.954-4.744 4.636 1.122 6.545z" />
                  </svg>
                ))}
              </div>
              <blockquote className={`text-sm leading-relaxed border-l-2 border-accent pl-4 ${isLight ? 'text-ink' : 'text-off-white/90'}`}>
                &ldquo;{isHi ? item.contentHi : item.content}&rdquo;
              </blockquote>
              <p className={`mt-4 font-semibold text-sm ${isLight ? 'text-ink' : 'text-off-white'}`}>{item.name}</p>
              <p className="text-xs text-muted">{item.location}</p>
            </GlassCard>
          ))}
        </Marquee>

        <p className="text-center">
          <Link to="/testimonials" className="text-sm font-semibold text-accent">{t('testimonials.readAll')} →</Link>
        </p>
      </motion.div>
    </section>
  );
}

export function FAQSection() {
  const { t } = useTranslation();
  const items = faqItems.map((f, i) => ({ id: i, question: t(f.qKey), answer: t(f.aKey) }));
  return <FAQBlock kicker={t('faq.kicker')} title={t('faq.title')} items={items} />;
}

export function FinalCTA() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';

  return (
    <section className={`section-padding ${isLight ? 'bg-off-white' : 'bg-primary'}`}>
      <motion.div className="container-premium">
        <GlassCard className="p-10 md:p-16 text-center relative overflow-hidden">
          <motion.div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 pointer-events-none" aria-hidden />
          <motion.div className="relative z-10 max-w-2xl mx-auto">
            <p className="section-kicker">{t('cta.kicker')}</p>
            <h2 className={`font-heading text-display-md mt-3 ${isLight ? 'text-ink' : 'text-off-white'}`}>{t('cta.title')}</h2>
            <p className={`mt-4 text-lg ${isLight ? 'text-muted' : 'text-slate-400'}`}>{t('cta.subtitle')}</p>
            <motion.div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button href={`tel:${SITE.phone}`} variant="secondary">{t('cta.call')}</Button>
              <Button to="/contact">{t('cta.form')}</Button>
            </motion.div>
          </motion.div>
        </GlassCard>
      </motion.div>
    </section>
  );
}
